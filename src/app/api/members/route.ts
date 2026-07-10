import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";


export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const members = await prisma.member.findMany({ orderBy: { joinedAt: "desc" } });
  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as { [key: string]: unknown };
  const passwordHash = await bcrypt.hash(String(body.password ?? ""), 12);
  const member = await prisma.member.create({
    data: {
      membershipNo: String(body.membershipNo),
      name: String(body.name),
      phone: String(body.phone),
      email: body.email ? String(body.email) : null,
      passwordHash,
      farmLocation: body.farmLocation ? String(body.farmLocation) : null,
    },
  });
  return NextResponse.json(member, { status: 201 });
}
