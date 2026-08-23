"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { playfair } from '@/app/fonts';
// KİLİT NOKTA 1: Lenis motorunu içeri aktardık
import { useLenis } from 'lenis/react';

const slides = [
    {
        id: 1,
        bgImage: "/slider1.webp",
        subtitle: "KORELİ ÇEYİZ ÖZEL KOLEKSİYONU",
        title: "Evinize Değer Katan",
        highlight: "Kaliteli Dokunuşlar",
        desc: "Yatak odanıza zarafet katacak en seçkin nevresim takımları, yatak örtüleri ve lüks çeyiz setleri.",
        btnText: "KOLEKSİYONU KEŞFET",
        btnLink: "#koleksiyonlar" // Bu id'ye kayacak
    },
    {
        id: 2,
        bgImage: "/slider2.webp",
        subtitle: "KAÇIRILMAYACAK FIRSATLAR",
        title: "Seçkin Tasarımlarda",
        highlight: "İndirim Ayrıcalığı",
        desc: "Sınırlı süre için geçerli olan, çeyizinizi tamamlayacak pike ve havlu setlerindeki özel fırsatları inceleyin.",
        btnText: "AVANTAJLI ÜRÜNLERİ GÖR",
        btnLink: "/avantajli-urunler" // Bu normal sayfa değiştirecek
    }
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);
    // KİLİT NOKTA 2: Lenis'i başlattık
    const lenis = useLenis();

    // Mobil cihazlar için dokunmatik kaydırma (touch swipe) yönetimi
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            // Sola kaydırma -> Sonraki slayt
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        } else if (isRightSwipe) {
            // Sağa kaydırma -> Önceki slayt
            setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    // KİLİT NOKTA 3: Butona tıklandığında çalışan akıllı kaydırma asistanı
    const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
        // Eğer link '#' ile başlıyorsa (yani sayfa içi kaydırma ise)
        if (link.startsWith('#')) {
            e.preventDefault(); // Sayfanın aniden "pat" diye atlamasını engelle
            lenis?.scrollTo(link, {
                offset: -100, // Navbar'ın yüksekliği kadar yukarıda fren yap ki başlık kapanmasın
                duration: 1.5 // 1.5 saniyede pamuk gibi kaysın
            });
        }
    };

    return (
        <div 
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="relative w-full h-[65vh] min-h-[550px] flex items-center justify-center overflow-hidden bg-stone-100"
        >

            {/* 1. KATMAN: Arka Plan Resimleri */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100 z-0' : 'opacity-0 z-0 pointer-events-none'
                        }`}
                >
                    <div
                        className={`absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-out ${index === current ? 'scale-105' : 'scale-100'
                            }`}
                        style={{ backgroundImage: `url(${slide.bgImage})` }}
                    />
                    <div className="absolute inset-0 bg-stone-900/10" />
                </div>
            ))}

            {/* 2. KATMAN: SABİT BUZLU CAM */}
            <div className="relative z-10 px-4 w-full flex justify-center">
                <div className="bg-white/90 backdrop-blur-md border border-white/60 shadow-2xl p-10 md:p-16 w-full max-w-3xl flex flex-col items-center justify-center text-center rounded-sm">

                    <div className="transition-opacity duration-700 w-full" key={current}>
                        <p className="text-[#966842] text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase mb-6 mt-2">
                            {slides[current].subtitle}
                        </p>

                        <h1 className={`${playfair.className} text-4xl md:text-6xl text-[#2A2A2A] mb-4 leading-tight`}>
                            {slides[current].title} <br />
                            <span className="italic font-light text-[#966842]">{slides[current].highlight}</span>
                        </h1>

                        <p className="text-stone-600 font-light max-w-xl text-sm md:text-base leading-relaxed mb-10 mx-auto">
                            {slides[current].desc}
                        </p>

                        <Link
                            href={slides[current].btnLink}
                            // KİLİT NOKTA 4: Tıklama olayını butonumuza bağladık
                            onClick={(e) => handleScrollClick(e, slides[current].btnLink)}
                            className="bg-[#2A2A2A] text-white px-10 py-4 text-xs font-medium tracking-[0.2em] uppercase hover:bg-[#966842] transition-colors duration-500 shadow-sm inline-block"
                        >
                            {slides[current].btnText}
                        </Link>
                    </div>

                </div>
            </div>

            {/* 3. KATMAN: Alt Kısımdaki Noktalar (Sitenin hafif ve lüks tasarımına uygun açık renkli cam kapsül) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2.5 bg-white/85 backdrop-blur-md border border-stone-200/40 px-4 py-2 rounded-full z-20 shadow-sm">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`transition-all duration-500 rounded-full cursor-pointer ${
                            index === current 
                                ? 'w-6 h-1 bg-[#966842]' 
                                : 'w-1.5 h-1 bg-stone-300 hover:bg-stone-400'
                        }`}
                        aria-label={`Slayt ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}