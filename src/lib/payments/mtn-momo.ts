import { PaymentProvider, PaymentRequest, PaymentResponse } from "./provider";

export class MTNMoMoProvider implements PaymentProvider {
  async initiate(request: PaymentRequest): Promise<PaymentResponse> {
    const { MTN_MOMO_SUBSCRIPTION_KEY, MTN_MOMO_API_USER, MTN_MOMO_API_KEY, MTN_MOMO_ENV } =
      process.env;

    if (!MTN_MOMO_SUBSCRIPTION_KEY || !MTN_MOMO_API_USER || !MTN_MOMO_API_KEY) {
      return { success: false, message: "MoMo not configured" };
    }

    const baseUrl =
      MTN_MOMO_ENV === "production"
        ? "https://api.mtn.com/v1_0"
        : "https://sandbox.momodeveloper.mtn.com/v1_0";

    try {
      const tokenRes = await fetch(`${baseUrl}/apiuser/${MTN_MOMO_API_USER}/apikey`, {
        method: "POST",
        headers: {
          "X-Reference-Id": crypto.randomUUID(),
          "Ocp-Apim-Subscription-Key": MTN_MOMO_SUBSCRIPTION_KEY,
        },
      });
      if (!tokenRes.ok) {
        return { success: false, message: "Failed to authenticate with MoMo" };
      }

      const paymentRes = await fetch(`${baseUrl}/requesttopay`, {
        method: "POST",
        headers: {
          "X-Reference-Id": crypto.randomUUID(),
          "X-Target-Environment": MTN_MOMO_ENV === "production" ? "production" : "sandbox",
          "Ocp-Apim-Subscription-Key": MTN_MOMO_SUBSCRIPTION_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: String(request.amount),
          currency: request.currency,
          externalId: request.orderRef,
          payer: { partyIdType: "MSISDN", partyId: request.phone },
          payerMessage: request.description || "Coop order payment",
          payeeNote: "Payment for Coop produce order",
        }),
      });

      if (!paymentRes.ok) {
        return { success: false, message: "Payment initiation failed" };
      }

      return {
        success: true,
        providerRef: paymentRes.headers.get("X-Reference-Id") || "",
        message: "Payment prompt sent to your phone",
      };
    } catch {
      return { success: false, message: "Payment service unavailable" };
    }
  }

  async handleWebhook(payload: unknown): Promise<{ status: string; providerRef: string }> {
    const data = payload as { status?: string; referenceId?: string };
    return {
      status: data?.status === "SUCCESSFUL" ? "SUCCESS" : "FAILED",
      providerRef: data?.referenceId || "",
    };
  }
}
