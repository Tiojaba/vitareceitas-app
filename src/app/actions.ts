"use server";

import { redirect } from 'next/navigation';
import { analyzePaymentRisk } from '@/ai/flows/payment-risk-analysis';
import { checkoutFormSchema, type CheckoutFormSchema } from '@/lib/schemas';

export async function processPayment(data: CheckoutFormSchema) {
  // 1. Validate data on the server
  const validationResult = checkoutFormSchema.safeParse(data);
  if (!validationResult.success) {
    throw new Error('Invalid data provided. Please check your inputs.');
  }

  const { amount, customerName, customerEmail, orderInfo, webhookUrl } = validationResult.data;

  let riskAnalysisResult;
  try {
    // 2. Perform AI Risk Analysis
    riskAnalysisResult = await analyzePaymentRisk({
      amount,
      customerDetails: `Name: ${customerName}, Email: ${customerEmail}`,
      orderInformation: orderInfo,
    });
  } catch (aiError) {
    console.error("AI Risk Analysis failed:", aiError);
    throw new Error("Could not analyze payment risk at this time. Please try again later.");
  }
  
  // 3. Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 4. Send webhook notification
  try {
    const payload = {
      status: 'SUCCESS',
      paymentDetails: validationResult.data,
      riskAnalysis: riskAnalysisResult,
      timestamp: new Date().toISOString(),
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (webhookError) {
    console.error("Webhook notification failed:", webhookError);
    // Non-critical error: log it but don't fail the entire transaction.
    // In a real app, this might be queued for a retry.
  }

  // 5. Redirect to confirmation page
  const queryParams = new URLSearchParams({
    amount: amount.toString(),
    name: customerName,
    email: customerEmail,
    isHighRisk: String(riskAnalysisResult.isHighRisk),
    reason: riskAnalysisResult.reason,
  });

  redirect(`/confirmation?${queryParams.toString()}`);
}
