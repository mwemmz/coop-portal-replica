"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui";

interface Member {
  name: string;
  membershipNo: string;
  status: string;
  farmLocation?: string;
}
interface Contribution {
  quantityKg: number;
}
interface Payout {
  status: string;
  amount: number;
}

export default function PortalDashboardPage() {
  const { data: session } = useSession();
  const [member, setMember] = useState<Member | null>(null);
  const [stats, setStats] = useState({ contributions: 0, pendingPayouts: 0 });

  useEffect(() => {
    if (!session?.user?.id) return;
    const id = session.user.id;

    Promise.all([
      fetch(`/api/members/${id}`).then((r) => r.json() as unknown as Member),
      fetch(`/api/members/${id}/contributions`).then((r) => r.json() as unknown as Contribution[]),
      fetch(`/api/members/${id}/payouts`).then((r) => r.json() as unknown as Payout[]),
    ]).then(([memberData, contributions, payouts]) => {
      setMember(memberData);
      const totalKg = Array.isArray(contributions) ? contributions.reduce((s: number, c: { quantityKg: number }) => s + Number(c.quantityKg), 0) : 0;
      const pending = Array.isArray(payouts) ? payouts.filter((p: { status: string }) => p.status === "PENDING").reduce((s: number, p: { amount: number }) => s + Number(p.amount), 0) : 0;
      setStats({ contributions: totalKg, pendingPayouts: pending });
    });
  }, [session]);

  if (!member) {
    return <p className="text-surface/40">Loading...</p>;
  }

  return (
    <>
      <h1 className="font-serif text-3xl text-surface">Welcome back, {member.name}</h1>
      <p className="mt-1 text-surface/60">Here&apos;s your account overview.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <Card>
          <p className="text-xs text-surface/55 uppercase tracking-wide">Total Contributions</p>
          <p className="mt-1 font-mono text-2xl text-surface">{stats.contributions.toLocaleString()} kg</p>
        </Card>
        <Card>
          <p className="text-xs text-surface/55 uppercase tracking-wide">Pending Payouts</p>
          <p className="mt-1 font-mono text-2xl text-surface">ZMW {stats.pendingPayouts.toFixed(2)}</p>
        </Card>
        <Card>
          <p className="text-xs text-surface/55 uppercase tracking-wide">Membership Status</p>
          <p className="mt-1 font-semibold text-surface capitalize">{member.status.toLowerCase()}</p>
        </Card>
      </div>

      <Card className="mt-8">
        <h2 className="font-serif text-lg text-surface">Recent Activity</h2>
        <p className="mt-2 text-sm text-surface/55">
          Your contributions and payouts will appear here as they are recorded.
        </p>
      </Card>
    </>
  );
}
