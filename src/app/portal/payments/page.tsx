"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, StatusBadge, statusTone } from "@/components/ui";

interface Payout {
  id: string;
  amount: number;
  status: string;
  paidAt: string | null;
}

export default function PortalPaymentsPage() {
  const { data: session } = useSession();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch(`/api/members/${session.user.id}/payouts`)
      .then((r) => r.json() as unknown as Payout[])
      .then((data) => { setPayouts(data); setLoading(false); });
  }, [session]);

  return (
    <>
      <h1 className="font-serif text-3xl text-surface">My Payments</h1>
      <p className="mt-1 text-surface/60">Payout history from the Cooperative.</p>

      <Card className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-surface/55">
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium text-right">Amount (ZMW)</th>
              <th className="pb-3 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="py-8 text-center text-surface/45">Loading...</td></tr>
            ) : payouts.length === 0 ? (
              <tr><td colSpan={3} className="py-8 text-center text-surface/45">No payout records yet.</td></tr>
            ) : (
              payouts.map((p) => (
                <tr key={p.id} className="border-b border-line/50">
                  <td className="py-3 font-mono text-xs">
                    {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-3 font-mono text-right">{Number(p.amount).toFixed(2)}</td>
                  <td className="py-3 text-right">
                    <StatusBadge tone={statusTone(p.status)}>{p.status}</StatusBadge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}
