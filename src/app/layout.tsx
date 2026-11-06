import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RESTAURANT_NAME } from "@/lib/config";
import { CartProvider } from "@/lib/cart/cart-context";
import { CartBar } from "@/components/cart/cart-bar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: RESTAURANT_NAME,
  description: `${RESTAURANT_NAME} – online bestellen`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        <CartProvider>
          {children}
          <CartBar />
        </CartProvider>
      </body>
    </html>
  );
}
