"use client";

import { useState, useEffect } from "react";
import { Card, StatusBadge, statusTone } from "@/components/ui";

interface Order {
  id: string;
  reference: string;
  buyerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const statusOrder = ["PENDING", "CONFIRMED", "DISPATCHED", "COMPLETED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    const res = await fetch("/api/orders");
    const data = (await res.json()) as unknown as Order[];
    setOrders(data);
    setLoading(false);
  }

  useEffect(() => { fetchOrders(); }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  }

  return (
    <>
      <h1 className="font-serif text-3xl text-surface">Orders</h1>

      <Card className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-surface/55">
              <th className="pb-3 font-medium">Reference</th>
              <th className="pb-3 font-medium">Buyer</th>
              <th className="pb-3 font-medium text-right">Total</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-surface/45">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-surface/45">No orders yet.</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-b border-line/50">
                  <td className="py-3 font-mono text-xs">{o.reference}</td>
                  <td className="py-3">{o.buyerName}</td>
                  <td className="py-3 font-mono text-right">ZMW {Number(o.totalAmount).toFixed(2)}</td>
                  <td className="py-3">
                    <StatusBadge tone={statusTone(o.status)}>{o.status}</StatusBadge>
                  </td>
                  <td className="py-3 font-mono text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="py-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="rounded-lg border border-line px-2 py-1 text-xs bg-surface"
                    >
                      {statusOrder.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
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
