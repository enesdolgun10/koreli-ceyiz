"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ImageIcon, ArrowRight } from 'lucide-react';
import { API_URL } from '@/utils/config';

type Product = {
    id: number;
    name: string;
    price: number;
    old_price?: number | null;
    image_url?: string;
};

export default function NavbarSearch() {
    const [query, setQuery] = useState("");
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filteredResults, setFilteredResults] = useState<Product[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Ürünleri çeken fonksiyonu dışarı çıkardık ve kararlı (stable) hale getirdik
    const fetchProductsForSearch = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/products/`, { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setAllProducts(data);
            }
        } catch (error) {
            console.error("Arama verileri güncellenirken hata oluştu:", error);
        }
    }, []);

    // İlk açılışta yine de bir kere çeksin
    useEffect(() => {
        fetchProductsForSearch();
    }, [fetchProductsForSearch]);

    // Dışarı tıklayınca kapatma mekanizması
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Anlık arama filtresi
    useEffect(() => {
        if (query.trim() === "") {
            setFilteredResults([]);
            setIsOpen(false);
            return;
        }

        const results = allProducts.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredResults(results.slice(0, 5));
        setIsOpen(true);
    }, [query, allProducts]);

    const handleProductClick = (id: number) => {
        setIsOpen(false);
        setQuery("");
        router.push(`/products/${id}`);
    };

    return (
        <div ref={searchRef} className="relative w-full max-w-md mx-auto">
            <div className="relative flex items-center border-b border-stone-200 py-1 transition-colors focus-within:border-[#966842]">
                <Search className="w-4 h-4 text-stone-400 shrink-0 mr-2" strokeWidth={1.5} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    // KİLİT NOKTA: Kullanıcı kutuya tıkladığı an (onFocus) listeyi arkada hemen güncelliyoruz
                    onFocus={() => {
                        fetchProductsForSearch();
                        if (query.trim() !== "") {
                            setIsOpen(true);
                        }
                    }}
                    placeholder="Koleksiyonda arayın..."
                    className="w-full bg-transparent text-sm text-stone-800 placeholder-stone-400 focus:outline-none font-light tracking-wide py-1 pr-8"
                />
                {query && (
                    <button
                        onClick={() => setQuery("")}
                        className="absolute right-1 text-stone-400 hover:text-stone-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-stone-100 shadow-xl z-50 max-h-[380px] overflow-y-auto rounded-sm animate-in fade-in slide-in-from-top-2 duration-200">
                    {filteredResults.length === 0 ? (
                        <div className="p-6 text-center text-xs text-stone-400 font-light tracking-widest uppercase">
                            Aradığınız ürün bulunamadı
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <div className="p-3 bg-stone-50/50 border-b border-stone-100 text-[10px] tracking-[0.15em] uppercase text-stone-400 font-medium">
                                Önerilen Ürünler ({filteredResults.length})
                            </div>

                            {filteredResults.map((product) => {
                                const hasDiscount = product.old_price && product.old_price > product.price;
                                return (
                                    <div
                                        key={product.id}
                                        onClick={() => handleProductClick(product.id)}
                                        className="flex items-center gap-4 p-3 hover:bg-stone-50/80 border-b border-stone-50 last:border-0 cursor-pointer transition-colors group"
                                    >
                                        <div className="w-12 aspect-[3/4] bg-stone-50 relative overflow-hidden shrink-0 border border-stone-100">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-stone-300">
                                                    <ImageIcon className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col flex-grow min-w-0">
                                            <span className="text-sm font-medium text-stone-800 truncate group-hover:text-[#966842] transition-colors">
                                                {product.name}
                                            </span>

                                            <div className="flex items-center gap-2 mt-0.5">
                                                {hasDiscount && (
                                                    <span className="text-[11px] text-stone-400 line-through">
                                                        {product.old_price!.toLocaleString('tr-TR')} TL
                                                    </span>
                                                )}
                                                <span className="text-xs text-[#966842] font-medium">
                                                    {product.price.toLocaleString('tr-TR')} TL
                                                </span>
                                            </div>
                                        </div>

                                        <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#966842] transition-all transform -translate-x-2 group-hover:translate-y-0 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 shrink-0" />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}