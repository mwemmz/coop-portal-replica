"use client";

import { Button, Card } from "@/components/ui";

const reports = [
  { label: "Members", entity: "members" },
  { label: "Orders", entity: "orders" },
  { label: "Payments", entity: "payments" },
];

export default function AdminReportsPage() {
  function exportCSV(entity: string) {
    window.open(`/api/admin/export?entity=${entity}`, "_blank");
  }

  return (
    <>
      <h1 className="font-serif text-3xl text-surface">Reports</h1>
      <p className="mt-1 text-surface/60">Export Cooperative data as CSV.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.label}>
            <h2 className="font-serif text-lg text-surface">{r.label}</h2>
            <p className="mt-1 text-xs text-surface/55">Download all {r.label.toLowerCase()} data as CSV</p>
            <Button variant="secondary" className="mt-4 w-full" onClick={() => exportCSV(r.entity)}>
              Export CSV
            </Button>
          </Card>
        ))}
      </div>
    </>
  );
}
