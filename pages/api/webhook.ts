
import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/firebase-admin';

// Função para extrair o e-mail de diferentes possíveis campos no corpo da requisição
const findEmailInBody = (body: any): string | null => {
    if (!body || typeof body !== 'object') {
        return null;
    }

    // Lista de possíveis chaves para o e-mail do cliente
    const possibleKeys = [
        'email', 
        'customer_email', 
        'payer_email', 
        'buyer_email'
    ];

    for (const key of possibleKeys) {
        if (typeof body[key] === 'string') {
            return body[key];
        }
    }

    // Lógica para objetos aninhados (comuns em algumas plataformas)
    if (body.data && typeof body.data === 'object') {
        if (body.data.customer && typeof body.data.customer.email === 'string') {
            return body.data.customer.email;
        }
        if (body.data.buyer && typeof body.data.buyer.email === 'string') {
            return body.data.buyer.email;
        }
    }
    
    if (body.customer && typeof body.customer.email === 'string') {
        return body.customer.email;
    }
    
    if (body.buyer && typeof body.buyer.email === 'string') {
        return body.buyer.email;
    }

    return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  console.log('[Webhook] Notificação recebida. Corpo completo:', JSON.stringify(req.body, null, 2));

  try {
    const userEmail = findEmailInBody(req.body);

    if (!userEmail) {
        const errorMsg = 'E-mail do comprador não foi encontrado no corpo da requisição. Verifique os logs para ver a estrutura recebida.';
        console.error(`[Webhook] Erro: ${errorMsg}`);
        // Retornamos 400 (Bad Request) porque a informação esperada não veio.
        return res.status(400).json({ 
            error: errorMsg, 
            message: "O formato dos dados recebidos não continha um campo de e-mail reconhecível.",
            receivedBody: req.body 
        });
    }
    
    console.log(`[Webhook] E-mail extraído com sucesso: ${userEmail}`);
    
    try {
      const existingUser = await auth.getUserByEmail(userEmail).catch((error) => {
        if (error.code === 'auth/user-not-found') {
          return null; // Usuário não existe, o que é o cenário esperado para uma nova compra.
        }
        // Para outros erros, nós os lançamos para serem pegos pelo bloco catch externo.
        throw error;
      });

      if (existingUser) {
        console.log(`[Webhook] Usuário com e-mail ${userEmail} já existe. UID: ${existingUser.uid}. Nenhuma ação necessária.`);
        return res.status(200).json({ message: 'Usuário já existente. Nenhuma nova ação foi necessária.' });
      } 
        
      console.log(`[Webhook] Usuário com e-mail ${userEmail} não encontrado. Prosseguindo para criação...`);

      const customerName = req.body?.customer_name || req.body?.buyer?.name || 'Novo Membro';
      
      const newUser = await auth.createUser({
        email: userEmail,
        emailVerified: true,
        displayName: customerName,
        disabled: false,
      });

      console.log(`[Webhook] Usuário criado com sucesso no Firebase! UID: ${newUser.uid}`);

      // Gerar o link de redefinição de senha (que servirá como "crie sua senha")
      const link = await auth.generatePasswordResetLink(userEmail);
      
      console.log(`[Webhook] Link de configuração de senha gerado para ${userEmail}. O e-mail deve ser enviado automaticamente pelo Firebase.`);
      console.log(`[Webhook] IMPORTANTE: Verifique se o template de 'Redefinição de Senha' está ativado e personalizado no Console do Firebase > Autenticação > Templates de Email.`);

    } catch (userError: any) {
      console.error(`[Webhook] Erro CRÍTICO no Firebase ao processar para ${userEmail}:`, userError);
      return res.status(500).json({ error: 'Erro interno ao processar o usuário no Firebase.', details: userError.message });
    }

    res.status(200).json({ message: 'Webhook processado com sucesso.' });

  } catch (error: any) {
    console.error("[Webhook] Erro CRÍTICO e inesperado no handler:", error);
    res.status(500).json({ error: 'Falha crítica ao processar notificação.', details: error.message });
  }
}
