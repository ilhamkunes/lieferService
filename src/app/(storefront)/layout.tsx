import { CartProvider } from "@/lib/cart/cart-context";
import { CartBar } from "@/components/cart/cart-bar";

export default function StorefrontLayout({ children }: LayoutProps<"/">) {
  return (
    <CartProvider>
      <div className="min-h-screen md:bg-neutral-200">
        <div className="mx-auto min-h-screen w-full bg-cream md:max-w-xl md:shadow-xl">
          {children}
        </div>
      </div>
      <CartBar />
    </CartProvider>
  );
}
