import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";


export async function GET(req: Request) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const entity = url.searchParams.get("entity") || "members";

  let csv = "";
  if (entity === "members") {
    const members = await prisma.member.findMany();
    csv = ["membershipNo,name,phone,email,status,joinedAt"]
      .concat(members.map((m) => `${m.membershipNo},"${m.name}",${m.phone},${m.email || ""},${m.status},${m.joinedAt.toISOString()}`))
      .join("\n");
  } else if (entity === "orders") {
    const orders = await prisma.order.findMany();
    csv = ["reference,buyerName,buyerPhone,totalAmount,status,createdAt"]
      .concat(orders.map((o) => `${o.reference},"${o.buyerName}",${o.buyerPhone},${o.totalAmount},${o.status},${o.createdAt.toISOString()}`))
      .join("\n");
  } else if (entity === "payments") {
    const payments = await prisma.payment.findMany({ include: { order: true } });
    csv = ["orderRef,provider,amount,status,loggedAt"]
      .concat(payments.map((p) => `${p.order.reference},${p.provider},${p.amount},${p.status},${p.loggedAt.toISOString()}`))
      .join("\n");
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${entity}-export.csv"`,
    },
  });
}
