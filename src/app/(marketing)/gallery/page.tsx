export default function GalleryPage() {
  const placeholders = Array.from({ length: 6 }, (_, i) => i + 1);
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="font-serif text-4xl text-surface">Gallery</h1>
      <p className="mt-2 text-surface/70">Photos from our farms, members, and events.</p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {placeholders.map((i) => (
          <div
            key={i}
            className="glass-card aspect-[4/3] flex items-center justify-center text-surface/35 text-sm"
          >
            Photo {i}
          </div>
        ))}
      </div>
    </div>
  );
}
