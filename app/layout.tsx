import type { Metadata } from "next";
import { Bebas_Neue, Inter, Manrope } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Woni-Jo Portfolio",
  description: "Full-stack portfolio with Next.js and Supabase",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bebas.variable} ${inter.variable} ${manrope.variable} antialiased`}>
        {children}
        {modal}
      </body>
    </html>
  );
}
