'use server';

/**
 * @fileOverview AI-powered payment risk analysis flow.
 *
 * - analyzePaymentRisk - Analyzes payment risk and determines if additional verification is needed.
 * - PaymentRiskAnalysisInput - The input type for the analyzePaymentRisk function.
 * - PaymentRiskAnalysisOutput - The return type for the analyzePaymentRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PaymentRiskAnalysisInputSchema = z.object({
  amount: z.number().describe('The payment amount.'),
  customerDetails: z.string().describe('Details about the customer.'),
  orderInformation: z.string().describe('Information about the order.'),
});
export type PaymentRiskAnalysisInput = z.infer<typeof PaymentRiskAnalysisInputSchema>;

const PaymentRiskAnalysisOutputSchema = z.object({
  isHighRisk: z.boolean().describe('Whether the payment is considered high risk.'),
  reason: z.string().describe('The reason for the risk assessment.'),
  additionalVerificationRequired: z.boolean().describe('Whether additional verification steps are required.'),
});
export type PaymentRiskAnalysisOutput = z.infer<typeof PaymentRiskAnalysisOutputSchema>;

export async function analyzePaymentRisk(input: PaymentRiskAnalysisInput): Promise<PaymentRiskAnalysisOutput> {
  return paymentRiskAnalysisFlow(input);
}

const paymentRiskAnalysisPrompt = ai.definePrompt({
  name: 'paymentRiskAnalysisPrompt',
  input: {schema: PaymentRiskAnalysisInputSchema},
  output: {schema: PaymentRiskAnalysisOutputSchema},
  prompt: `You are an AI expert in fraud detection and risk assessment for online payments.
  Analyze the following payment information and determine if the payment is high risk.

  Payment Amount: {{{amount}}}
  Customer Details: {{{customerDetails}}}
  Order Information: {{{orderInformation}}}

  Based on the information provided, assess the risk level and provide a reason for your assessment.  Also, determine if additional verification steps are required. Ensure that isHighRisk and additionalVerificationRequired are boolean values.

  Return a JSON object with the following format:
  {
    "isHighRisk": boolean,
    "reason": string,
    "additionalVerificationRequired": boolean
  }`,
});

const paymentRiskAnalysisFlow = ai.defineFlow(
  {
    name: 'paymentRiskAnalysisFlow',
    inputSchema: PaymentRiskAnalysisInputSchema,
    outputSchema: PaymentRiskAnalysisOutputSchema,
  },
  async input => {
    const {output} = await paymentRiskAnalysisPrompt(input);
    return output!;
  }
);
