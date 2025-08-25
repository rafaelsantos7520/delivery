import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { CartIcon } from "@/components/CartIcon";
import { Header } from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prime acaiteria - Açaí,sorvetes,lanches,batidas",
  description: "Prime Açaiteria - O melhor açaí, sorvetes, lanches e bebidas da região. Experimente nossas deliciosas combinações de açaí, milk shakes, batidas de frutas frescas e lanches saborosos. Venha conhecer nosso cardápio repleto de opções para todos os gostos!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <Header />
          {children}
          <CartIcon />
        </CartProvider>
      </body>
    </html>
  );
}
