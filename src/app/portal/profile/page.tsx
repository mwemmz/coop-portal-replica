"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, Button, Input } from "@/components/ui";

interface Member {
  id: string;
  membershipNo: string;
  name: string;
  phone: string;
  email: string | null;
  farmLocation: string | null;
}

export default function PortalProfilePage() {
  const { data: session } = useSession();
  const [member, setMember] = useState<Member | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch(`/api/members/${session.user.id}`)
      .then((r) => r.json() as unknown as Member)
      .then((data: Member) => {
        setMember(data);
        setName(data.name);
        setPhone(data.phone);
        setEmail(data.email || "");
        setFarmLocation(data.farmLocation || "");
      });
  }, [session]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!member) return;
    setSaving(true);
    await fetch(`/api/members/${member.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email: email || null, farmLocation: farmLocation || null }),
    });
    setMember({ ...member, name, phone, email, farmLocation });
    setSaving(false);
    setEditing(false);
  }

  if (!member) return <p className="text-surface/40">Loading...</p>;

  return (
    <>
      <h1 className="font-serif text-3xl text-surface">My Profile</h1>
      <Card className="mt-6 max-w-xl">
        {editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <Input label="Full Name" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Phone" id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <Input label="Email" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Farm Location" id="farm" value={farmLocation} onChange={(e) => setFarmLocation(e.target.value)} />
            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
              <Button type="button" variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-surface/85">Full Name</label>
              <p className="rounded-lg border border-line bg-surface-2 px-4 py-2 text-sm">{member.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-surface/85">Membership No.</label>
              <p className="rounded-lg border border-line bg-surface-2 px-4 py-2 font-mono text-sm">{member.membershipNo}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-surface/85">Phone</label>
              <p className="rounded-lg border border-line bg-surface-2 px-4 py-2 text-sm">{member.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-surface/85">Email</label>
              <p className="rounded-lg border border-line bg-surface-2 px-4 py-2 text-sm">{member.email || "—"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-surface/85">Farm Location</label>
              <p className="rounded-lg border border-line bg-surface-2 px-4 py-2 text-sm">{member.farmLocation || "—"}</p>
            </div>
            <Button variant="secondary" onClick={() => setEditing(true)}>Edit Profile</Button>
          </div>
        )}
      </Card>
    </>
  );
}
