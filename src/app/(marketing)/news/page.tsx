"use client";

import { useState, useEffect } from "react";

interface NewsItem {
  slug: string;
  title: string;
  body: string;
  updatedAt: string;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slugs = ["news-1", "news-2", "news-3"];
    Promise.all(
      slugs.map(async (slug) => {
        const res = await fetch(`/api/content/${slug}`);
        if (res.ok) return (await res.json()) as NewsItem;
        return null;
      })
    ).then((results) => {
      setArticles(results.filter((a): a is NewsItem => a !== null));
      setLoading(false);
    });
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-serif text-4xl text-surface">News & Announcements</h1>
      <p className="mt-2 text-surface/70">
        Updates from the Cooperative and the Zambian avocado sector.
      </p>
      <div className="mt-10 space-y-6">
        {loading ? (
          <p className="text-surface/40">Loading...</p>
        ) : articles.length === 0 ? (
          [1, 2, 3].map((i) => (
            <article key={i} className="glass-card p-6">
              <h2 className="font-serif text-xl text-surface">
                Announcement Title {i}
              </h2>
              <p className="mt-2 text-sm text-surface/75">
                This is a sample news article. Content from the Cooperative will appear here
                once published through the admin panel.
              </p>
            </article>
          ))
        ) : (
          articles.map((a) => (
            <article key={a.slug} className="glass-card p-6">
              <p className="font-mono text-xs text-surface/70">
                {new Date(a.updatedAt).toLocaleDateString()}
              </p>
              <h2 className="mt-1 font-serif text-xl text-surface">{a.title}</h2>
              <p className="mt-2 text-sm text-surface/75 whitespace-pre-line">{a.body}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
