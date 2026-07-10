"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ totalMembers: 0, activeOrders: 0, pendingPayments: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json() as unknown as typeof stats)
      .then((data) => { setStats(data); setLoading(false); });
  }, []);

  return (
    <>
      <h1 className="font-serif text-3xl text-surface">Admin Dashboard</h1>
      <p className="mt-1 text-surface/60">Cooperative overview at a glance.</p>

      {loading ? (
        <p className="mt-8 text-surface/40">Loading...</p>
      ) : (
        <>
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            <Card>
              <p className="text-xs text-surface/55 uppercase tracking-wide">Total Members</p>
              <p className="mt-1 font-mono text-xl text-surface">{stats.totalMembers}</p>
            </Card>
            <Card>
              <p className="text-xs text-surface/55 uppercase tracking-wide">Active Orders</p>
              <p className="mt-1 font-mono text-xl text-surface">{stats.activeOrders}</p>
            </Card>
            <Card>
              <p className="text-xs text-surface/55 uppercase tracking-wide">Pending Payments</p>
              <p className="mt-1 font-mono text-xl text-surface">{stats.pendingPayments}</p>
            </Card>
            <Card>
              <p className="text-xs text-surface/55 uppercase tracking-wide">Revenue (ZMW)</p>
              <p className="mt-1 font-mono text-xl text-surface">{Number(stats.revenue).toLocaleString()}</p>
            </Card>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card>
              <h2 className="font-serif text-lg text-surface">Recent Orders</h2>
              <p className="mt-2 text-sm text-surface/55">View all orders in the Orders section.</p>
            </Card>
            <Card>
              <h2 className="font-serif text-lg text-surface">Recent Members</h2>
              <p className="mt-2 text-sm text-surface/55">Manage members in the Members section.</p>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
