"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";

export default function CombinedLoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNote("This is a front-end demo. Authentication is disabled in this replica.");
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl bg-surface/70 backdrop-blur-xl border border-white/20 p-8 shadow-lg">
        <h1 className="font-serif text-2xl text-surface text-center">Sign In</h1>
        <p className="mt-1 text-center text-sm text-surface/50">
          Use your phone number or email
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Phone or Email"
            id="identifier"
            type="text"
            placeholder="+260 XXX XXX XXX or you@email.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {note && <p className="text-sm text-surface/80">{note}</p>}
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
