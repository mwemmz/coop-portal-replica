"use client";

import { useState, useEffect } from "react";
import { Button, Input, Card } from "@/components/ui";

interface Listing {
  id: string;
  name: string;
  category: string;
  grade: string;
  price: number;
  quantityKg: number;
  status: string;
}

const emptyForm = { name: "", category: "fresh", grade: "A", price: 0, quantityKg: 0, status: "ACTIVE" };

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  async function fetchListings() {
    const res = await fetch("/api/listings");
    const data = (await res.json()) as unknown as Listing[];
    setListings(data);
    setLoading(false);
  }

  useEffect(() => { fetchListings(); }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await fetch(`/api/listings/${editing}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    fetchListings();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this listing?")) return;
    await fetch(`/api/listings/${id}`, { method: "DELETE" });
    fetchListings();
  }

  function handleEdit(listing: Listing) {
    setForm({
      name: listing.name,
      category: listing.category,
      grade: listing.grade,
      price: Number(listing.price),
      quantityKg: Number(listing.quantityKg),
      status: listing.status,
    });
    setEditing(listing.id);
    setShowForm(true);
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-surface">Produce Listings</h1>
        <Button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}>
          New Listing
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg glass-card-strong p-6">
            <h2 className="font-serif text-xl text-surface">{editing ? "Edit Listing" : "New Listing"}</h2>
            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <Input label="Name" id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="category" className="text-sm font-medium text-surface/85">Category</label>
                  <select id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-1 min-h-[44px] w-full rounded-lg border border-line bg-surface px-4 text-ink">
                    <option value="fresh">Fresh</option>
                    <option value="processed">Processed</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label htmlFor="grade" className="text-sm font-medium text-surface/85">Grade</label>
                  <select id="grade" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })}
                    className="mt-1 min-h-[44px] w-full rounded-lg border border-line bg-surface px-4 text-ink">
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input label="Price per kg (ZMW)" id="price" type="number" step="0.01" value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} required />
                </div>
                <div className="flex-1">
                  <Input label="Quantity (kg)" id="qty" type="number" value={form.quantityKg}
                    onChange={(e) => setForm({ ...form, quantityKg: parseFloat(e.target.value) || 0 })} required />
                </div>
              </div>
              <div>
                <label htmlFor="status" className="text-sm font-medium text-surface/85">Status</label>
                <select id="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="mt-1 min-h-[44px] w-full rounded-lg border border-line bg-surface px-4 text-ink">
                  <option value="ACTIVE">Active</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</Button>
                <Button type="submit">{editing ? "Update" : "Create"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Card className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-surface/55">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Grade</th>
              <th className="pb-3 font-medium text-right">Price/kg</th>
              <th className="pb-3 font-medium text-right">Qty (kg)</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
              {loading ? (
              <tr><td colSpan={7} className="py-8 text-center text-surface/45">Loading...</td></tr>
            ) : listings.length === 0 ? (
              <tr><td colSpan={7} className="py-8 text-center text-surface/45">No listings yet. Click &ldquo;New Listing&rdquo; to add one.</td></tr>
            ) : (
              listings.map((l) => (
                <tr key={l.id} className="border-b border-line/50">
                  <td className="py-3 font-medium">{l.name}</td>
                  <td className="py-3 text-xs capitalize">{l.category}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-surface/20 px-2 py-0.5 text-xs font-semibold text-surface">{l.grade}</span>
                  </td>
                  <td className="py-3 font-mono text-right">{Number(l.price).toFixed(2)}</td>
                  <td className="py-3 font-mono text-right">{Number(l.quantityKg).toFixed(0)}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${l.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {l.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" className="text-xs px-3 py-1" onClick={() => handleEdit(l)}>Edit</Button>
                      <Button variant="secondary" className="text-xs px-3 py-1 border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(l.id)}>Delete</Button> 
                    </div>
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
