"use client";

import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalAmount, itemCount, clearCart } = useCart();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-surface">Your Cart</h1>
        {items.length > 0 && (
          <Button variant="secondary" onClick={clearCart}>Clear Cart</Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-surface/50">Your cart is empty.</p>
          <Link href="/produce">
            <Button className="mt-4">Browse Produce</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div key={item.listingId} className="glass-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-serif text-lg text-surface">{item.name}</p>
                      <span className="rounded-full bg-surface/20 px-2 py-0.5 text-xs font-semibold text-surface">
                        {item.grade}
                      </span>
                    </div>
                    <p className="font-mono text-sm text-surface mt-1">
                      ZMW {item.price.toFixed(2)} / kg
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.listingId, item.quantityKg - 1)}
                        className="min-h-[44px] min-w-[44px] rounded-lg border border-line bg-surface text-ink hover:bg-line/30"
                      >
                        &minus;
                      </button>
                      <span className="font-mono text-lg w-12 text-center">{item.quantityKg}</span>
                      <button
                        onClick={() => updateQuantity(item.listingId, item.quantityKg + 1)}
                        className="min-h-[44px] min-w-[44px] rounded-lg border border-line bg-surface text-ink hover:bg-line/30"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-mono text-lg text-surface w-28 text-right">
                      ZMW {(item.price * item.quantityKg).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.listingId)}
                      className="min-h-[44px] min-w-[44px] text-surface/40 hover:text-red-500 text-xl"
                      aria-label="Remove"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">
                Total ({itemCount} kg): <span className="font-mono text-surface">ZMW {totalAmount.toFixed(2)}</span>
              </p>
            </div>
            <div className="mt-6 flex gap-4">
              <Link href="/produce">
                <Button variant="secondary">Continue Shopping</Button>
              </Link>
              <Link href="/checkout">
                <Button>Proceed to Checkout</Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
