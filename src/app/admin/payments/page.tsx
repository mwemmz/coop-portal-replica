"use client";

import { useState, useEffect } from "react";
import { Card, StatusBadge, statusTone } from "@/components/ui";

interface Payment {
  id: string;
  provider: string;
  providerRef: string;
  amount: number;
  status: string;
  loggedAt: string;
  order: { reference: string };
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments")
      .then((r) => r.json() as unknown as Payment[])
      .then((data) => { setPayments(data); setLoading(false); });
  }, []);

  return (
    <>
      <h1 className="font-serif text-3xl text-surface">Payments</h1>

      <Card className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-surface/55">
              <th className="pb-3 font-medium">Order Ref</th>
              <th className="pb-3 font-medium">Provider</th>
              <th className="pb-3 font-medium text-right">Amount</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="py-8 text-center text-surface/45">Loading...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-surface/45">No payments recorded.</td></tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="border-b border-line/50">
                  <td className="py-3 font-mono text-xs">{p.order.reference}</td>
                  <td className="py-3 text-xs">{p.provider}</td>
                  <td className="py-3 font-mono text-right">ZMW {Number(p.amount).toFixed(2)}</td>
                  <td className="py-3">
                    <StatusBadge tone={statusTone(p.status)}>{p.status}</StatusBadge>
                  </td>
                  <td className="py-3 font-mono text-xs">{new Date(p.loggedAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}
