import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";


export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await prisma.order.findMany({
    include: { items: { include: { listing: true } }, payment: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { [key: string]: unknown };
  const reference = `COOP-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const order = await prisma.order.create({
    data: {
      reference,
      buyerName: String(body.buyerName),
      buyerPhone: String(body.buyerPhone),
      buyerEmail: body.buyerEmail ? String(body.buyerEmail) : null,
      isBulk: Boolean(body.isBulk),
      totalAmount: Number(body.totalAmount),
      items: {
        create: Array.isArray(body.items)
          ? (body.items as { listingId: string; quantityKg: number; unitPrice: number }[]).map((item) => ({
              listingId: item.listingId,
              quantityKg: item.quantityKg,
              unitPrice: item.unitPrice,
            }))
          : [],
      },
    },
    include: { items: true },
  });
  return NextResponse.json(order, { status: 201 });
}
