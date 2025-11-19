export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink">Checkout</h1>
        <p className="mt-2 text-ink-muted">Complete your order</p>
      </div>
      {children}
    </div>
  );
}



