import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";


const encoder = new TextEncoder();

export async function POST(req: NextRequest) {
  const { token, password } = (await req.json()) as {
    token?: string;
    password?: string;
  };

  if (!token || !password) {
    return NextResponse.json({ error: "token and password are required" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  let payload: { sub?: string; type?: string };
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) throw new Error("NEXTAUTH_SECRET is not set");
    const result = await jwtVerify(token, encoder.encode(secret));
    payload = result.payload as typeof payload;
  } catch {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  if (!payload.sub || !payload.type) {
    return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
  }

  const hash = await bcrypt.hash(password, 12);

  if (payload.type === "member") {
    const member = await prisma.member.findUnique({ where: { id: payload.sub } });
    if (!member) return NextResponse.json({ error: "Account not found" }, { status: 404 });
    await prisma.member.update({ where: { id: payload.sub }, data: { passwordHash: hash } });
  } else {
    const admin = await prisma.adminUser.findUnique({ where: { id: payload.sub } });
    if (!admin) return NextResponse.json({ error: "Account not found" }, { status: 404 });
    await prisma.adminUser.update({ where: { id: payload.sub }, data: { passwordHash: hash } });
  }

  return NextResponse.json({ message: "Password updated successfully" });
}
