"use client";

import { useEffect, useState } from 'react';
import { useFavorites } from '@/components/FavoritesContext';
import Link from 'next/link';
import { playfair } from '@/app/fonts';
import { Heart } from 'lucide-react';
import { API_URL } from '@/utils/config';

type Product = {
    id: number;
    name: string;
    price: number;
    image_url?: string | null;
};

export default function FavoritesPage() {
    const { favorites, syncFavorites } = useFavorites();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavoriteProducts = async () => {
            if (favorites.length === 0) {
                setProducts([]);
                setLoading(false);
                return;
            }

            try {
                // Güncel ürün listesini API'den çekiyoruz
                const res = await fetch(`${API_URL}/products/`, { cache: 'no-store' });
                if (res.ok) {
                    const allProducts: Product[] = await res.json();

                    // Sadece veritabanında HALA VAR OLAN ve kullanıcının favorilediği ürünleri filtrele
                    const validProducts = allProducts.filter(p => favorites.includes(p.id));
                    setProducts(validProducts);

                    // KİLİT NOKTA: Gerçekten var olan ürünlerin ID'lerini bir diziye çıkarıyoruz
                    const validIds = validProducts.map(p => p.id);

                    // Eğer hafızadaki ID sayısı ile veritabanından dönen eşleşmiyorsa (yani silinen ürün varsa)
                    if (validIds.length !== favorites.length) {
                        // Hafızayı (ve dolayısıyla navbar sayısını) anında güncel ve temiz liste ile eşitle!
                        syncFavorites(validIds);
                    }
                }
            } catch (error) {
                console.error("Favori ürünler senkronize edilemedi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoriteProducts();
    }, [favorites, syncFavorites]);

    if (loading) {
        return <div className="text-center py-24 text-stone-400 font-light tracking-widest text-sm uppercase">Favorileriniz Yükleniyor...</div>;
    }

    return (
        <main className="bg-white min-h-screen pt-12 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center flex flex-col items-center mb-16">
                    <h1 className={`${playfair.className} text-4xl md:text-5xl text-[#2A2A2A] mb-4`}>Favorilerim</h1>
                    <div className="w-12 h-[1px] bg-[#966842]"></div>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center gap-4">
                        <Heart className="w-8 h-8 text-stone-300 font-light" strokeWidth={1} />
                        <p className="text-stone-400 font-light tracking-widest text-sm uppercase">
                            Favori listeniz henüz boş.
                        </p>
                        <Link href="/" className="text-xs tracking-widest uppercase bg-[#2A2A2A] text-white px-6 py-3 mt-4 hover:bg-[#966842] transition-colors">
                            Alışverişe Başla
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-16 md:gap-x-8">
                        {products.map((product) => (
                            <Link href={`/products/${product.id}`} key={product.id} className="group flex flex-col gap-4">
                                <div className="relative aspect-[3/4] overflow-hidden bg-[#FAFAFA] rounded-sm shadow-sm">
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                                    ) : (
                                        <div className="absolute inset-0 bg-stone-100" />
                                    )}
                                </div>
                                <div className="flex flex-col items-center text-center px-2">
                                    <h3 className="text-sm font-medium text-[#2A2A2A] tracking-wide mb-1 line-clamp-2">{product.name}</h3>
                                    <span className="text-[#966842] text-sm font-semibold">{product.price.toLocaleString('tr-TR')} TL</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}