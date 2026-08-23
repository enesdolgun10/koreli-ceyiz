"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Heart, Phone, X, Home, Tags } from 'lucide-react';
import { playfair } from '@/app/fonts';
import NavbarSearch from './NavbarSearch';
import { useFavorites } from './FavoritesContext';

export default function Navbar() {
    const { favorites } = useFavorites();
    const [isScrolled, setIsScrolled] = useState(false);

    // KİLİT NOKTA: Mobil menünün açık/kapalı durumunu tutan state
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Mobil menü açıldığında alttaki sayfanın kaymasını engelle
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    return (
        <>
            <nav
                className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-white/85 backdrop-blur-md border-b border-stone-200/50 shadow-sm'
                    : 'bg-white border-b border-stone-100'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">

                        <div className="flex items-center gap-4">
                            {/* Mobil Menü Açma Butonu */}
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="p-2 -ml-2 text-stone-400 hover:text-[#966842] transition md:hidden"
                            >
                                <Menu className="h-6 w-6" strokeWidth={1.5} />
                            </button>

                            <Link href="/" className="flex items-center gap-4 group">
                                <img
                                    src="/logo.png"
                                    alt="Koreli Çeyiz"
                                    className="h-16 w-auto object-contain transform origin-center shrink-0"
                                />
                                <div className="flex flex-col justify-center pt-1">
                                    <span className={`${playfair.className} text-2xl sm:text-3xl font-bold text-[#2A2A2A] tracking-widest leading-none`}>
                                        KORELİ <span className="text-[#966842] font-light italic">ÇEYİZ</span>
                                    </span>
                                    <span className="text-stone-400 text-[8px] sm:text-[10px] tracking-[0.35em] font-medium uppercase mt-2 ml-0.5 group-hover:text-[#966842] transition-colors duration-300">
                                        Mustafa Dolgun
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Masaüstü Arama Çubuğu */}
                        <div className="hidden md:flex flex-1 max-w-2xl mx-12">
                            <NavbarSearch />
                        </div>

                        <div className="flex items-center gap-6 sm:gap-8">
                            <Link href="/favoriler" className="text-[#2A2A2A] hover:text-[#966842] transition flex items-center gap-2 group relative">
                                <Heart className="h-5 w-5 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                                <span className="hidden sm:block text-xs font-medium tracking-[0.15em] uppercase">Favoriler</span>

                                {favorites.length > 0 && (
                                    <span className="absolute -top-2 -right-2.5 sm:-right-3 bg-[#966842] text-white text-[9px] sm:text-[10px] font-bold rounded-full h-[16px] w-[16px] sm:h-[18px] sm:w-[18px] flex items-center justify-center shadow-sm">
                                        {favorites.length}
                                    </span>
                                )}
                            </Link>

                            <a
                                href="https://wa.me/905426650749?text=Merhaba,%20sitenizden%20ula%C5%9F%C4%B1yorum.%20Bilgi%20alabilir%20miyim?"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#2A2A2A] hover:text-[#966842] transition flex items-center gap-2 group hidden sm:flex"
                            >
                                <Phone className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                                <span className="text-xs font-medium tracking-[0.15em] uppercase">Bize Ulaşın</span>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* KİLİT NOKTA: MOBİL MENÜ ARKA PLAN KARARTMASI */}
            <div
                className={`fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* KİLİT NOKTA: MOBİL MENÜ ÇEKMECESİ (DRAWER) */}
            <div
                className={`fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-[70] md:hidden transform transition-transform duration-500 ease-[custom-ease] shadow-2xl flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-6 border-b border-stone-100">
                    <span className={`${playfair.className} text-xl font-bold text-[#2A2A2A] tracking-widest`}>
                        MENÜ
                    </span>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    {/* Mobil Arama Çubuğu */}
                    <div className="mb-8">
                        <label className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2 block font-medium">Ürün Ara</label>
                        <NavbarSearch />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2 block font-medium">Hızlı Erişim</label>

                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-[#966842] rounded transition-colors uppercase tracking-wider">
                            <Home className="w-4 h-4 text-stone-400" /> Ana Sayfa
                        </Link>

                        <Link href="/#koleksiyonlar" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-[#966842] rounded transition-colors uppercase tracking-wider">
                            <Tags className="w-4 h-4 text-stone-400" /> Koleksiyonlar
                        </Link>

                        <a href="https://wa.me/905426650749" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-[#966842] rounded transition-colors uppercase tracking-wider">
                            <Phone className="w-4 h-4 text-stone-400" /> İletişime Geç
                        </a>
                    </div>
                </div>

                <div className="p-6 bg-stone-50 border-t border-stone-100 text-center">
                    <p className="text-xs text-stone-500 font-light tracking-widest uppercase">Koreli Çeyiz &copy; {new Date().getFullYear()}</p>
                </div>
            </div>
        </>
    );
}