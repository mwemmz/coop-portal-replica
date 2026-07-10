"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { Button, Card } from "@/components/ui";
import Link from "next/link";


interface Listing {
  id: string;
  name: string;
  category: string;
  grade: string;
  price: number;
  quantityKg: number;
  images: string;
  status: string;
}

export default function ProduceDetailPage({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    fetch(`/api/listings/${params.id}`)
      .then((r) => { if (!r.ok) return null; return r.json() as unknown as Listing; })
      .then((data) => { setListing(data); setLoading(false); });
  }, [params.id]);

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-16 text-surface/40">Loading...</div>;
  if (!listing || listing.status !== "ACTIVE") return notFound();

  const images: string[] = (() => { try { return JSON.parse(listing.images); } catch { return []; } })();

  function handleAdd() {
    if (!listing) return;
    addItem({
      listingId: listing.id,
      name: listing.name,
      price: Number(listing.price),
      quantityKg: qty,
      grade: listing.grade,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <Link href="/produce" className="text-sm text-surface hover:underline">&larr; Back to produce</Link>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="aspect-square rounded-xl bg-avocado-flesh/10 border border-line flex items-center justify-center text-surface/30">
          {images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[0]} alt={listing.name} className="rounded-xl object-cover w-full h-full" />
          ) : (
            <span>Image placeholder</span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-avocado-flesh/20 px-3 py-1 text-xs font-semibold text-surface">
              {listing.grade}
            </span>
            <span className="text-xs text-surface/40 capitalize">{listing.category}</span>
          </div>
          <h1 className="mt-3 font-serif text-3xl text-surface">{listing.name}</h1>
          <p className="mt-4 font-mono text-2xl text-surface">
            ZMW {Number(listing.price).toFixed(2)} / kg
          </p>
          <p className="mt-1 text-sm text-surface/50">
            {Number(listing.quantityKg).toFixed(0)} kg available
          </p>
          <Card className="mt-6">
            <label className="text-sm font-medium text-surface/85">Quantity (kg)</label>
            <div className="mt-1 flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={Number(listing.quantityKg)}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Math.min(Number(listing.quantityKg), parseInt(e.target.value) || 1)))}
                className="w-24 rounded-lg border border-line bg-surface px-3 py-2 text-center font-mono text-sm"
              />
              <Button onClick={handleAdd}>
                {added ? "Added!" : "Add to Cart"}
              </Button>
            </div>
          </Card>
          <div className="mt-4 flex gap-3">
            <Link href="/cart">
              <Button variant="secondary">View Cart</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
