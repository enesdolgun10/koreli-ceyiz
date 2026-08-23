"use client";

import { useState, useRef } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Plus, Trash2, Tags, ImageIcon, CheckCircle, UploadCloud, Loader2 } from 'lucide-react';

export default function CategoryManager() {
    const { categories, catImageFile, setCatImageFile, addCategory, deleteCategory, isUploading, handleCropOpen, showToast } = useAdmin();
    const [newCatName, setNewCatName] = useState("");
    const [newCatDesc, setNewCatDesc] = useState("");
    const catInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatName.trim()) {
            showToast("Kategori adı alanı boş bırakılamaz.", "error");
            return;
        }
        const success = await addCategory(newCatName.trim(), newCatDesc.trim() || null);
        if (success) {
            setNewCatName("");
            setNewCatDesc("");
            setCatImageFile(null);
        }
    };

    return (
        <div data-lenis-prevent className="flex flex-col gap-4 xl:h-full min-h-0">
            {/* Üst Form Alanı */}
            <div className="bg-white p-4 shadow-sm border border-stone-200 shrink-0">
                <h2 className="text-sm font-medium flex items-center gap-2 mb-3 border-b pb-2 text-stone-800">
                    <Tags className="w-4 h-4 text-[#966842]" /> Yeni Kategori Ekle
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Kategori Adı</label>
                        <input type="text" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Örn: Yatak Odası" className="w-full border border-stone-300 px-2 py-1.5 text-sm focus:outline-none focus:border-[#966842]" />
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Açıklama (İsteğe Bağlı)</label>
                        <textarea value={newCatDesc} onChange={(e) => setNewCatDesc(e.target.value)} rows={2} placeholder="Koleksiyon açıklaması..." className="w-full border border-stone-300 px-2 py-1.5 text-sm focus:outline-none focus:border-[#966842] resize-none"></textarea>
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Kapak Görseli</label>
                        <div className="border border-dashed border-stone-300 p-2 flex flex-col items-center justify-center bg-[#FAFAFA] hover:bg-stone-50 transition-colors cursor-pointer text-center h-14 w-full overflow-hidden" onClick={() => catInputRef.current?.click()}>
                            <input type="file" accept="image/*" className="hidden" ref={catInputRef} onChange={(e) => {
                                if (e.target.files && e.target.files[0]) handleCropOpen('category', e.target.files[0]);
                                e.target.value = '';
                            }} />
                            {catImageFile ? (
                                <div className="flex items-center gap-1 text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-[10px] font-medium">Hazır</span>
                                </div>
                            ) : (
                                <div className="text-stone-400">
                                    <UploadCloud className="w-4 h-4 mx-auto mb-0.5 opacity-60" />
                                    <span className="text-[9px] uppercase tracking-wider block break-words">Görsel Seç</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <button disabled={isUploading} type="submit" className="w-full bg-[#2A2A2A] text-white py-2 text-xs uppercase tracking-widest font-medium hover:bg-[#966842] transition-colors flex items-center justify-center gap-2 mt-1">
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Ekle
                    </button>
                </form>
            </div>

            {/* Alt Kategori Listesi Alanı */}
            <div className="bg-white p-4 shadow-sm border border-stone-200 xl:flex-1 flex flex-col min-h-0">
                <h2 className="text-sm font-medium flex items-center gap-2 mb-3 border-b pb-2 text-stone-800 shrink-0">
                    Mevcut Kategoriler
                </h2>
                <ul data-lenis-prevent className="flex flex-col gap-2 xl:flex-1 xl:overflow-y-auto min-h-0 scrollbar-premium pr-1">
                    {categories.map(cat => (
                        <li key={cat.id} className="flex items-center justify-between border border-stone-100 p-2 hover:bg-[#FAFAFA]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-stone-100 rounded overflow-hidden flex items-center justify-center border border-stone-200 shrink-0">
                                    {cat.image_url ? <img src={cat.image_url} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-3 h-3 text-stone-300" />}
                                </div>
                                <span className="text-xs font-medium text-stone-700 capitalize line-clamp-1">{cat.name}</span>
                            </div>
                            <button onClick={() => deleteCategory(cat.id)} className="text-stone-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}