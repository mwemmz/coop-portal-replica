"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, message }),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = (await res.json()) as { error?: string };
      setError(data.error || "Something went wrong. Please try again.");
    }
    setSubmitting(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-serif text-4xl text-surface">Contact Us</h1>
      <p className="mt-2 text-surface/70">
        Get in touch with the Cooperative secretariat.
      </p>
      <div className="mt-10 grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-xl text-surface">Send a message</h2>
          {submitted ? (
            <div className="mt-4 rounded-lg bg-pit/10 backdrop-blur-sm border border-pit/30 p-4 text-sm text-surface">
              Thank you! Your message has been sent. We will get back to you shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <Input label="Your Name" id="name" placeholder="Enter your name"
                value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Email" id="email" type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input label="Phone" id="phone" type="tel" placeholder="+260 XXX XXX XXX"
                value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <div className="flex flex-col gap-1">
                <label htmlFor="message" className="text-sm font-medium text-surface">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[44px] rounded-lg border border-line bg-surface px-4 py-2 text-ink placeholder:text-ink/50 focus:outline-none focus:ring-2 focus:ring-avocado-flesh"
                  placeholder="How can we help?"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" disabled={submitting}>
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </div>
        <div>
          <h2 className="font-serif text-xl text-surface">Visit us</h2>
          <div className="mt-4 glass-card-strong p-6 space-y-4 text-sm text-surface/75">
            <p>
              <strong className="text-surface">Office:</strong>
              <br />
              Cooperative Society Cooperative
              <br />
              Great East Road, Lusaka, Zambia
            </p>
            <p>
              <strong className="text-surface">Phone:</strong>
              <br />
              +260 XXX XXX XXX
            </p>
            <p>
              <strong className="text-surface">Email:</strong>
              <br />
              info@coop.example
            </p>
            <p>
              <strong className="text-surface">Hours:</strong>
              <br />
              Mon&ndash;Fri, 08:00 &ndash; 17:00 CAT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
