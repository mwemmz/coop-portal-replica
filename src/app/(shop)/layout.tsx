export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="min-h-[60vh]"
      style={{
        background: "linear-gradient(180deg, rgba(132, 162, 79, 0.25) 0%, rgba(53, 64, 38, 0.10) 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {children}
    </main>
  );
}
