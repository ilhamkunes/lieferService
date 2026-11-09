import { CartProvider } from "@/lib/cart/cart-context";
import { CartBar } from "@/components/cart/cart-bar";
import { CookieNotice } from "@/components/cookie-notice";

export default function StorefrontLayout({ children }: LayoutProps<"/">) {
  return (
    <CartProvider>
      <div className="min-h-screen md:bg-neutral-200">
        <div className="mx-auto min-h-screen w-full bg-cream md:max-w-5xl md:shadow-xl">
          {children}
        </div>
      </div>
      <CartBar />
      <CookieNotice />
    </CartProvider>
  );
}
