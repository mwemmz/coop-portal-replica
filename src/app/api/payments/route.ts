import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";


export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payments = await prisma.payment.findMany({
    include: { order: true },
    orderBy: { loggedAt: "desc" },
  });
  return NextResponse.json(payments);
}
