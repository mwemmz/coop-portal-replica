import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MTNMoMoProvider } from "@/lib/payments/mtn-momo";


export async function POST(req: NextRequest) {
  const payload = (await req.json()) as Record<string, unknown>;
  const provider = new MTNMoMoProvider();
  const { status, providerRef } = await provider.handleWebhook(payload);

  const payment = await prisma.payment.findFirst({ where: { providerRef } });
  if (payment) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: status as "SUCCESS" | "FAILED" },
    });
    if (status === "SUCCESS") {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: "CONFIRMED" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
