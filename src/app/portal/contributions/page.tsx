"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui";

interface Contribution {
  id: string;
  produceType: string;
  grade: string;
  quantityKg: number;
  deliveredAt: string;
}

export default function PortalContributionsPage() {
  const { data: session } = useSession();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch(`/api/members/${session.user.id}/contributions`)
      .then((r) => r.json() as unknown as Contribution[])
      .then((data) => { setContributions(data); setLoading(false); });
  }, [session]);

  return (
    <>
      <h1 className="font-serif text-3xl text-surface">My Contributions</h1>
      <p className="mt-1 text-surface/60">Records of produce you&apos;ve delivered to the Cooperative.</p>

      <Card className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-surface/55">
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Produce</th>
              <th className="pb-3 font-medium">Grade</th>
              <th className="pb-3 font-medium text-right">Quantity (kg)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="py-8 text-center text-surface/45">Loading...</td></tr>
            ) : contributions.length === 0 ? (
              <tr><td colSpan={4} className="py-8 text-center text-surface/45">No contributions recorded yet.</td></tr>
            ) : (
              contributions.map((c) => (
                <tr key={c.id} className="border-b border-line/50">
                  <td className="py-3 font-mono text-xs text-surface">{new Date(c.deliveredAt).toLocaleDateString()}</td>
                  <td className="py-3 text-surface">{c.produceType}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-surface/20 px-2 py-0.5 text-xs font-semibold text-surface">
                      {c.grade}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-right text-surface">{Number(c.quantityKg).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}
