"use client";

import { useState, useEffect } from "react";
import { Button, Card } from "@/components/ui";

interface ContentPage {
  id: string;
  slug: string;
  title: string;
  body: string;
  published: boolean;
}

export default function AdminContentPage() {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");
  const [editTitle, setEditTitle] = useState("");

  async function fetchPages() {
    setLoading(true);
    const slugs = ["about", "home", "contact"];
    const results = await Promise.all(
      slugs.map(async (slug) => {
        const res = await fetch(`/api/content/${slug}`);
        if (res.ok) return (await res.json()) as ContentPage;
        return null;
      })
    );
    setPages(results.filter((p): p is ContentPage => p !== null));
    setLoading(false);
  }

  useEffect(() => { fetchPages(); }, []);

  async function handleSave(slug: string) {
    await fetch(`/api/content/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, body: editBody }),
    });
    setEditing(null);
    fetchPages();
  }

  async function togglePublish(slug: string, current: boolean) {
    await fetch(`/api/content/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !current }),
    });
    fetchPages();
  }

  return (
    <>
      <h1 className="font-serif text-3xl text-surface">Content Pages</h1>
      <p className="mt-1 text-surface/60">Manage marketing site pages and news articles.</p>

      {loading ? (
        <p className="mt-6 text-surface/40">Loading...</p>
      ) : (
        <div className="mt-6 space-y-4">
          {pages.map((p) => (
            <Card key={p.slug}>
              {editing === p.slug ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-surface/85">Title</label>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="mt-1 min-h-[44px] w-full rounded-lg border border-line bg-surface px-4 text-ink"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-surface/85">Body</label>
                    <textarea
                      rows={8}
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      className="mt-1 min-h-[120px] w-full rounded-lg border border-line bg-surface px-4 py-2 text-ink"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
                    <Button onClick={() => handleSave(p.slug)}>Save</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-surface">{p.title}</p>
                    <p className="font-mono text-xs text-surface/45">/{p.slug}</p>
                    <p className="mt-2 text-sm text-surface/75 line-clamp-2">{p.body}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <button
                      onClick={() => togglePublish(p.slug, p.published)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold cursor-pointer ${
                        p.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {p.published ? "Published" : "Draft"}
                    </button>
                    <Button variant="secondary" className="text-xs"
                      onClick={() => { setEditing(p.slug); setEditTitle(p.title); setEditBody(p.body); }}>
                      Edit
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
