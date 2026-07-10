import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SignJWT } from "jose";


const encoder = new TextEncoder();
function getSecret(): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET is not set");
  return encoder.encode(secret);
}

export async function POST(req: NextRequest) {
  const { identifier, type } = (await req.json()) as {
    identifier?: string;
    type?: "member" | "admin";
  };

  if (!identifier || !type) {
    return NextResponse.json({ error: "identifier and type are required" }, { status: 400 });
  }

  let userId: string | null = null;

  if (type === "member") {
    const member = await prisma.member.findUnique({ where: { phone: identifier } });
    if (!member) return NextResponse.json({ error: "No account found with that phone" }, { status: 404 });
    userId = member.id;
  } else {
    const admin = await prisma.adminUser.findUnique({ where: { email: identifier } });
    if (!admin) return NextResponse.json({ error: "No account found with that email" }, { status: 404 });
    userId = admin.id;
  }

  const token = await new SignJWT({ sub: userId, type })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .sign(getSecret());

  const resetUrl = `${req.nextUrl.origin}/${type === "member" ? "portal" : "admin"}/reset?token=${token}`;

  return NextResponse.json({
    message: "Reset link generated",
    resetUrl,
    devNote: "In production, send this URL via SMS/email instead of returning it.",
  });
}
