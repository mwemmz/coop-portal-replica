import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MTNMoMoProvider } from "@/lib/payments/mtn-momo";
import { rateLimit } from "@/lib/rate-limit";


export async function POST(req: NextRequest) {
  const body = (await req.json()) as { [key: string]: unknown };
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed } = rateLimit(`momo:${ip}:${body.phone || "unknown"}`, { interval: 60_000, max: 3 });

  if (!allowed) {
    return NextResponse.json({ error: "Too many payment attempts. Try again later." }, { status: 429 });
  }
  const order = await prisma.order.findUnique({ where: { reference: String(body.orderRef ?? "") } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const provider = new MTNMoMoProvider();
  const result = await provider.initiate({
    amount: Number(order.totalAmount),
    currency: "ZMW",
    phone: String(body.phone ?? ""),
    orderRef: order.reference,
    description: `Payment for order ${order.reference}`,
  });

  if (result.success && result.providerRef) {
    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: "MTN_MOMO",
        providerRef: result.providerRef,
        amount: order.totalAmount,
        status: "PENDING",
      },
    });
  }

  return NextResponse.json(result);
}
