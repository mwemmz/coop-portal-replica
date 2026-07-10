import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  const { ref } = await params;
  const payment = await prisma.payment.findFirst({
    where: { providerRef: ref },
    include: { order: { select: { status: true, reference: true } } },
  });

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: payment.status,
    providerRef: payment.providerRef,
    orderRef: payment.order.reference,
    orderStatus: payment.order.status,
    amount: payment.amount,
    loggedAt: payment.loggedAt,
  });
}
