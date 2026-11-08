import { CartProvider } from "@/lib/cart/cart-context";
import { CartBar } from "@/components/cart/cart-bar";

export default function StorefrontLayout({ children }: LayoutProps<"/">) {
  return (
    <CartProvider>
      <div className="min-h-full md:bg-neutral-100">
        <div className="mx-auto min-h-full w-full bg-white md:max-w-xl md:shadow-sm">
          {children}
        </div>
      </div>
      <CartBar />
    </CartProvider>
  );
}
