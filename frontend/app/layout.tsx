import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { montserrat } from "./fonts";
import { FavoritesProvider } from "@/components/FavoritesContext";
import ScrollToTop from "@/components/ScrollToTop";
import SmoothScroll from "@/components/SmoothScroll"; // 1. BİLEŞENİ İÇERİ AKTARDIK

export const metadata: Metadata = {
  title: "Koreli Çeyiz | Balıkesir'in Öncü Çeyiz & Ev Tekstili Mağazası",
  description: "Koreli Çeyiz ile evinizi güzelleştirin. En özel yatak örtüleri, nevresim takımları, bornoz setleri ve en şık çeyiz paketleri yılların tecrübesi ve kalitesiyle sizleri bekliyor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${montserrat.className} bg-stone-50 text-stone-900 antialiased min-h-screen flex flex-col`}>

        {/* 2. TÜM SİTEYİ PÜRÜZSÜZ KAYDIRMA BİLEŞENİYLE SARMALADIK */}
        <SmoothScroll>
          <FavoritesProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <ScrollToTop />
          </FavoritesProvider>
        </SmoothScroll>

      </body>
    </html>
  );
}