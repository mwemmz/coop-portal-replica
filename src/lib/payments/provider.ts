export interface PaymentRequest {
  amount: number;
  currency: string;
  phone: string;
  orderRef: string;
  description?: string;
}

export interface PaymentResponse {
  success: boolean;
  providerRef?: string;
  message: string;
}

export interface PaymentProvider {
  initiate(request: PaymentRequest): Promise<PaymentResponse>;
  handleWebhook(payload: unknown): Promise<{ status: string; providerRef: string }>;
}
