import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const body = (await req.json()) as { name?: string; phone?: string; email?: string; message?: string };

  if (!body.name || !body.phone || !body.message) {
    return NextResponse.json({ error: "Name, phone, and message are required" }, { status: 400 });
  }

  // For PoC: log contact submissions. In production, send email and/or store in DB.
  console.log("[Contact]", { name: body.name, phone: body.phone, email: body.email || "—", message: body.message });

  return NextResponse.json({ success: true, message: "Thank you! We will get back to you shortly." });
}
