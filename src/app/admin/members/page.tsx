"use client";

import { useState, useEffect } from "react";
import { Card, Button, Input, StatusBadge, statusTone } from "@/components/ui";

interface Member {
  id: string;
  membershipNo: string;
  name: string;
  phone: string;
  email: string | null;
  status: string;
  joinedAt: string;
}

const emptyForm = { membershipNo: "", name: "", phone: "", email: "", password: "", farmLocation: "" };

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function fetchMembers() {
    const res = await fetch("/api/members");
    const data = (await res.json()) as unknown as Member[];
    setMembers(data);
    setLoading(false);
  }

  useEffect(() => { fetchMembers(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm(emptyForm);
    fetchMembers();
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-surface">Members</h1>
        <Button onClick={() => setShowForm(true)}>Add Member</Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg glass-card-strong p-6">
            <h2 className="font-serif text-xl text-surface">New Member</h2>
            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <Input label="Membership No." id="membershipNo" value={form.membershipNo}
                onChange={(e) => setForm({ ...form, membershipNo: e.target.value })} required />
              <Input label="Full Name" id="name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input label="Phone" id="phone" type="tel" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              <Input label="Email" id="email" type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input label="Password" id="password" type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              <Input label="Farm Location" id="farmLocation" value={form.farmLocation}
                onChange={(e) => setForm({ ...form, farmLocation: e.target.value })} />
              <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => { setShowForm(false); setForm(emptyForm); }}>Cancel</Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Card className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-surface/55">
              <th className="pb-3 font-medium">Membership No</th>
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Phone</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="py-8 text-center text-surface/45">Loading...</td></tr>
            ) : members.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-surface/45">No members yet.</td></tr>
            ) : (
              members.map((m) => (
                <tr key={m.id} className="border-b border-line/50">
                  <td className="py-3 font-mono text-xs">{m.membershipNo}</td>
                  <td className="py-3">{m.name}</td>
                  <td className="py-3 text-xs">{m.phone}</td>
                  <td className="py-3">
                    <StatusBadge tone={statusTone(m.status)}>{m.status}</StatusBadge>
                  </td>
                  <td className="py-3 font-mono text-xs">{new Date(m.joinedAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}
