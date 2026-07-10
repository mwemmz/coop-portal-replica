"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { Button, Input } from "@/components/ui";

type Step = "form" | "processing" | "polling" | "done" | "error";

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const router = useRouter();
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [orderRef, setOrderRef] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, []);

  if (items.length === 0 && step === "form") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-serif text-3xl text-surface">Checkout</h1>
        <p className="mt-4 text-surface/50">Your cart is empty.</p>
      </div>
    );
  }

  async function pollStatus(ref: string) {
    try {
      const res = await fetch(`/api/payments/momo/status/${ref}`);
      if (!res.ok) return;
      const data = (await res.json()) as { status?: string };
      setPaymentStatus(data.status ?? "");
      if (data.status === "SUCCESS") {
        if (pollingRef.current) clearInterval(pollingRef.current);
        clearCart();
        setStep("done");
      } else if (data.status === "FAILED") {
        if (pollingRef.current) clearInterval(pollingRef.current);
        setErrorMsg("Payment failed. Please try again.");
        setStep("error");
      }
    } catch {
      // keep polling
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStep("processing");

    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerName,
          buyerPhone,
          buyerEmail: buyerEmail || undefined,
          totalAmount,
          items: items.map((i) => ({
            listingId: i.listingId,
            quantityKg: i.quantityKg,
            unitPrice: i.price,
          })),
        }),
      });

      if (!orderRes.ok) throw new Error("Failed to create order");
      const order = (await orderRes.json()) as { reference?: string };
      setOrderRef(order.reference ?? "");

      const momoRes = await fetch("/api/payments/momo/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderRef: order.reference, phone: buyerPhone }),
      });

      const momoResult = (await momoRes.json()) as { success?: boolean; providerRef?: string; message?: string };

      if (momoResult.success && momoResult.providerRef) {
        setStep("polling");
        pollingRef.current = setInterval(() => pollStatus(momoResult.providerRef!), 3000);
      } else if (momoResult.message === "MoMo not configured") {
        clearCart();
        setStep("done");
      } else {
        setErrorMsg(momoResult.message || "Payment initiation failed. You can retry below.");
        setStep("error");
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStep("error");
    } finally {
      setSubmitting(false);
    }
  }

  function handleRetry() {
    setStep("form");
    setErrorMsg("");
  }

  if (step === "processing") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-serif text-3xl text-surface">Processing...</h1>
        <p className="mt-4 text-surface/60">Creating your order and sending a payment prompt to your phone.</p>
      </div>
    );
  }

  if (step === "polling") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-serif text-3xl text-surface">Payment Sent</h1>
        <p className="mt-2 text-surface/60">A payment prompt has been sent to {buyerPhone}.</p>
        <p className="mt-1 text-sm text-surface/50">Approve it on your phone to complete the order.</p>
        <p className="mt-4 font-mono text-xs text-surface">Ref: {orderRef}</p>
        <div className="mt-6 flex justify-center">
          <div className="h-2 w-32 overflow-hidden rounded-full bg-line">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-pit" />
          </div>
        </div>
        <p className="mt-2 text-xs text-surface/40">
          {paymentStatus === "SUCCESS" ? "Payment confirmed!" :
           paymentStatus === "FAILED" ? "Payment failed." :
           "Waiting for payment confirmation..."}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button variant="secondary" onClick={handleRetry}>Cancel & Retry</Button>
        </div>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-serif text-3xl text-surface">Order Placed!</h1>
        <p className="mt-2 text-surface/60">Your order has been placed successfully.</p>
        <p className="mt-1 font-mono text-sm text-surface">Reference: {orderRef}</p>
        <div className="mt-8 flex justify-center gap-4">
          <Button onClick={() => router.push("/produce")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-serif text-3xl text-surface">Checkout</h1>
      <p className="mt-1 text-sm text-surface/50">Checking out as guest — no account required.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <CardSection title="Buyer Details">
          <Input label="Full Name" id="name" placeholder="Enter your full name"
            value={buyerName} onChange={(e) => setBuyerName(e.target.value)} required />
          <Input label="Phone Number" id="phone" type="tel" placeholder="+260 XXX XXX XXX"
            value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} required />
          <Input label="Email (optional)" id="email" type="email" placeholder="you@example.com"
            value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} />
        </CardSection>

        <CardSection title="Payment Method">
          <label className="flex items-center gap-3 rounded-lg border border-white/30 p-4 cursor-pointer hover:bg-white/20 glass-strong">
            <input type="radio" name="payment" value="MTN_MOMO" defaultChecked className="accent-pit" />
            <div>
              <p className="font-medium text-surface">MTN Mobile Money</p>
              <p className="text-xs text-surface/55">Pay with MTN MoMo</p>
            </div>
          </label>
        </CardSection>

        <CardSection title="Order Summary">
          {items.map((item) => (
            <div key={item.listingId} className="flex justify-between text-sm">
              <span>{item.name} ({item.quantityKg} kg)</span>
              <span className="font-mono">ZMW {(item.price * item.quantityKg).toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between font-semibold text-lg border-t border-line pt-2">
            <span>Total</span>
            <span className="font-mono text-surface">ZMW {totalAmount.toFixed(2)}</span>
          </div>
        </CardSection>

        {step === "error" && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            <p>{errorMsg}</p>
            <button type="button" onClick={handleRetry} className="mt-2 underline">Try again</button>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Processing..." : "Place Order & Pay"}
        </Button>
      </form>
    </div>
  );
}

function CardSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card-strong p-6">
      <h2 className="mb-4 font-serif text-lg text-surface">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
