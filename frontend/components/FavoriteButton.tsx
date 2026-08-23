"use client";

import { useFavorites } from '@/components/FavoritesContext';
import { Heart } from 'lucide-react';

type Props = {
    productId: number;
    // İki farklı tasarımımız olacak: 'card' (Kategori sayfasındaki resim üstü) ve 'detail' (Detay sayfasındaki büyük buton)
    variant?: 'card' | 'detail';
};

export default function FavoriteButton({ productId, variant = 'card' }: Props) {
    const { favorites, toggleFavorite } = useFavorites();

    // Ürünün ID'si favori listemizde varsa 'isFav' true olur.
    const isFav = favorites.includes(productId);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault(); // Sayfa yenilenmesini veya başka linke gitmeyi engeller
        toggleFavorite(productId);
    };

    // 1. TASARIM: ÜRÜN DETAY SAYFASI İÇİN BÜYÜK BUTON
    if (variant === 'detail') {
        return (
            <button
                onClick={handleToggle}
                className={`w-full py-4 flex items-center justify-center gap-3 text-sm font-medium tracking-[0.2em] uppercase transition-all duration-300 shadow-sm border mb-8 ${isFav
                        ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100' // Favorideyken
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-red-500' // Favoride değilken
                    }`}
            >
                {/* KİLİT NOKTA: fill-current ile kalbin içini dolduruyoruz */}
                <Heart className={`w-5 h-5 transition-transform duration-300 ${isFav ? 'fill-current scale-110' : ''}`} />
                {isFav ? 'Favorilere Eklendi' : 'Favorilere Ekle'}
            </button>
        );
    }

    // 2. TASARIM: KATEGORİ SAYFASINDAKİ KARTLAR İÇİN KÖŞE BUTONU
    return (
        <button
            onClick={handleToggle}
            className={`absolute top-3 right-3 z-20 p-2.5 rounded-full transition-all duration-300 shadow-sm ${isFav
                    ? 'bg-white text-red-500 opacity-100 scale-100' // Favoriyse kalıcı görünür ve kırmızıdır
                    : 'bg-white/90 text-stone-400 opacity-0 group-hover:opacity-100 hover:text-red-500' // Değilse sadece üzerine gelince (hover) çıkar
                }`}
        >
            <Heart className={`w-4 h-4 transition-transform duration-300 ${isFav ? 'fill-current scale-110' : ''}`} />
        </button>
    );
}