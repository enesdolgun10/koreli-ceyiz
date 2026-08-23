// components/ProductList.tsx
"use client";

import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Search, Filter, ArrowUpDown, Edit2, Trash2, List, ImageIcon } from 'lucide-react';

export default function ProductList() {
    const { products, categories, setEditingId, setDeleteModal } = useAdmin();

    const [searchTerm, setSearchTerm] = useState("");
    const [filterCatId, setFilterCatId] = useState("ALL");
    const [sortConfig, setSortConfig] = useState("NEWEST");

    const getDisplayedProducts = () => {
        let result = products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCat = filterCatId === "ALL" || p.category_id.toString() === filterCatId;
            return matchesSearch && matchesCat;
        });
        result.sort((a, b) => {
            switch (sortConfig) {
                case "PRICE_ASC": return a.price - b.price;
                case "PRICE_DESC": return b.price - a.price;
                case "NAME_ASC": return a.name.localeCompare(b.name);
                case "NAME_DESC": return b.name.localeCompare(a.name);
                case "NEWEST": default: return b.id - a.id;
            }
        });
        return result;
    };

    const displayedProducts = getDisplayedProducts();

    return (
        // KİLİT NOKTA 1: "overflow-hidden" ile bu beyaz kutunun aşağı doğru sonsuza uzaması tamamen yasaklandı.
        <div data-lenis-prevent className="bg-white p-4 shadow-sm border border-stone-200 xl:h-full flex flex-col overflow-hidden">

            {/* Üst Alan (Arama vs.) shrink-0 ile ezilmesi engellendi */}
            <div className="flex flex-col gap-3 mb-3 border-b border-stone-100 pb-3 shrink-0">
                <h2 className="text-base font-medium flex items-center justify-between gap-2 text-stone-800">
                    <span className="flex items-center gap-2"><List className="w-4 h-4 text-[#966842]" /> Vitrin Listesi</span>
                    <span className="bg-stone-100 px-2 py-1 rounded text-xs text-stone-600 font-normal">{displayedProducts.length} Ürün</span>
                </h2>

                <div className="flex flex-col xl:flex-row gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                        <input type="text" placeholder="Ürün Ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-8 pr-3 py-1.5 border border-stone-300 text-sm focus:outline-none focus:border-[#966842]" />
                    </div>
                    <div className="flex gap-2 flex-1">
                        <div className="relative flex-1">
                            <Filter className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                            <select value={filterCatId} onChange={(e) => setFilterCatId(e.target.value)} className="w-full pl-7 pr-2 py-1.5 border border-stone-300 text-[11px] focus:outline-none focus:border-[#966842] bg-white appearance-none">
                                <option value="ALL">Tüm Kat.</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="relative flex-1">
                            <ArrowUpDown className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                            <select value={sortConfig} onChange={(e) => setSortConfig(e.target.value)} className="w-full pl-7 pr-2 py-1.5 border border-stone-300 text-[11px] focus:outline-none focus:border-[#966842] bg-white appearance-none">
                                <option value="NEWEST">En Yeni</option>
                                <option value="PRICE_ASC">Ucuzdan</option>
                                <option value="PRICE_DESC">Pahalıdan</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* KİLİT NOKTA 2: "flex-1 overflow-y-auto min-h-0" formülü! Sadece imleç bu alandayken tekerlek çalışır. */}
            <div data-lenis-prevent className="xl:flex-1 xl:overflow-y-auto overflow-x-auto min-h-0 scrollbar-premium pr-2">
                <table className="w-full text-left border-collapse min-w-[450px]">

                    {/* KİLİT NOKTA 3: sticky top-0 bg-white ile başlıklar kayarken yukarıda şık bir şekilde sabit kalır */}
                    <thead className="sticky top-0 z-10 bg-white">
                        <tr className="border-b border-stone-200 text-[10px] tracking-widest uppercase text-stone-400 bg-[#FAFAFA] shadow-sm">
                            <th className="py-2 pl-3 font-medium w-12">Görsel</th>
                            <th className="py-2 font-medium">Detay</th>
                            <th className="py-2 pr-3 font-medium text-right">İşlem</th>
                        </tr>
                    </thead>

                    <tbody>
                        {displayedProducts.length === 0 ? (
                            <tr><td colSpan={3} className="py-8 text-center text-stone-400 text-sm font-light">Kayıt bulunamadı.</td></tr>
                        ) : (
                            displayedProducts.map(prod => {
                                const catName = categories.find(c => c.id === prod.category_id)?.name || "Bilinmiyor";
                                return (
                                    <tr key={prod.id} className="border-b border-stone-100 hover:bg-[#FAFAFA] group transition-colors">
                                        <td className="py-2 pl-3">
                                            <div className="w-10 h-10 bg-stone-100 rounded overflow-hidden flex items-center justify-center border border-stone-200 relative">
                                                {prod.image_url ? <img src={prod.image_url} alt="Ürün" className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 text-stone-300" />}
                                            </div>
                                        </td>
                                        <td className="py-2 pl-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-stone-800 line-clamp-1">{prod.name}</span>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded capitalize">{catName}</span>
                                                    <span className="text-xs font-semibold text-[#966842]">{prod.price.toLocaleString('tr-TR')} TL</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2 pr-3 text-right align-middle">
                                            <div className="flex justify-end gap-1.5">
                                                <button onClick={() => setEditingId(prod.id)} className="p-1.5 bg-stone-100 text-stone-500 hover:text-white hover:bg-[#966842] rounded transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => setDeleteModal({ isOpen: true, id: prod.id, type: 'product', name: prod.name })} className="p-1.5 bg-stone-100 text-stone-500 hover:text-white hover:bg-red-500 rounded transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}