// components/ProductForm.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Plus, Package, Edit2, X, CheckCircle, UploadCloud, Loader2, Image as ImageIcon } from 'lucide-react';

export default function ProductForm() {
    const { categories, products, editingId, setEditingId, imageFile, setImageFile, galleryFiles, setGalleryFiles, addProduct, updateProduct, isUploading, handleCropOpen, showToast } = useAdmin();

    const [prodName, setProdName] = useState("");
    const [prodPrice, setProdPrice] = useState("");
    const [prodOldPrice, setProdOldPrice] = useState("");
    const [prodDesc, setProdDesc] = useState("");
    const [prodCatId, setProdCatId] = useState("");
    const [prodImageUrl, setProdImageUrl] = useState("");
    const [prodGalleryUrls, setProdGalleryUrls] = useState<string[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingId) {
            const prod = products.find(p => p.id === editingId);
            if (prod) {
                setProdName(prod.name);
                setProdPrice(prod.price.toString());
                setProdOldPrice(prod.old_price ? prod.old_price.toString() : "");
                setProdDesc(prod.description || "");
                setProdCatId(prod.category_id.toString());
                setProdImageUrl(prod.image_url || "");
                setImageFile(null);
                setProdGalleryUrls(prod.gallery_urls || []);
                setGalleryFiles([]);
            }
        } else {
            cancelEditing();
        }
    }, [editingId, products]);

    const cancelEditing = () => {
        setEditingId(null);
        setProdName("");
        setProdPrice("");
        setProdOldPrice("");
        setProdDesc("");
        setProdCatId("");
        setProdImageUrl("");
        setImageFile(null);
        setProdGalleryUrls([]);
        setGalleryFiles([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Ürün Adı Kontrolü
        if (!prodName.trim()) {
            showToast("Lütfen ürün adını giriniz.", "error");
            return;
        }

        // 2. Kategori Seçimi Kontrolü
        if (!prodCatId) {
            showToast("Lütfen bir kategori seçiniz.", "error");
            return;
        }

        // 3. Fiyat Kontrolü
        const priceVal = parseFloat(prodPrice);
        if (isNaN(priceVal) || priceVal < 0) {
            showToast("Satış fiyatı eksi değer veya geçersiz olamaz.", "error");
            return;
        }

        // 4. Eski Fiyat Kontrolü (varsa)
        if (prodOldPrice) {
            const oldPriceVal = parseFloat(prodOldPrice);
            if (isNaN(oldPriceVal) || oldPriceVal < 0) {
                showToast("Eski fiyat eksi değer veya geçersiz olamaz.", "error");
                return;
            }
        }

        // 5. Kapak Fotoğrafı Kontrolü
        if (!imageFile && !prodImageUrl) {
            showToast("Lütfen bir kapak fotoğrafı seçiniz.", "error");
            return;
        }

        const prodData = {
            name: prodName.trim(),
            price: priceVal,
            old_price: prodOldPrice ? parseFloat(prodOldPrice) : null,
            image_url: prodImageUrl || null,
            gallery_urls: prodGalleryUrls,
            description: prodDesc.trim() || "Açıklama girilmedi.",
            category_id: parseInt(prodCatId),
        };

        const success = editingId ? await updateProduct(editingId, prodData) : await addProduct(prodData);
        if (success) cancelEditing();
    };

    return (
        <div data-lenis-prevent className="bg-white p-4 shadow-sm border border-stone-200 xl:h-full flex flex-col">
            <h2 className="text-sm font-medium flex items-center gap-2 mb-3 border-b pb-2 text-stone-800 shrink-0">
                <Package className="w-4 h-4 text-[#966842]" />
                {editingId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
            </h2>

            <form onSubmit={handleSubmit} data-lenis-prevent className="flex flex-col gap-3 xl:flex-1 min-h-0 xl:overflow-y-auto scrollbar-premium pr-1">
                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Ürün Adı</label>
                    <input type="text" value={prodName} onChange={(e) => setProdName(e.target.value)} className="w-full border border-stone-300 px-2 py-1.5 text-sm focus:outline-none focus:border-[#966842]" />
                </div>

                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Satış Fiyatı</label>
                        <input type="number" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} className="w-full border border-stone-300 px-2 py-1.5 text-sm focus:outline-none focus:border-[#966842]" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Eski Fiyat</label>
                        <input type="number" value={prodOldPrice} onChange={(e) => setProdOldPrice(e.target.value)} className="w-full border border-stone-300 px-2 py-1.5 text-sm bg-stone-50 focus:outline-none focus:border-[#966842]" />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Kategori</label>
                    <select value={prodCatId} onChange={(e) => setProdCatId(e.target.value)} className="w-full border border-stone-300 px-2 py-1.5 text-sm focus:outline-none focus:border-[#966842] bg-white">
                        <option value="" disabled>Seçiniz</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id} className="capitalize">{cat.name}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Açıklama</label>
                    <textarea value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} rows={2} className="w-full border border-stone-300 px-2 py-1 text-sm focus:outline-none focus:border-[#966842] resize-none"></textarea>
                </div>

                <div className="flex gap-3 shrink-0">
                    <div className="flex-1">
                        <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Kapak (3:4)</label>
                        <div className="border border-dashed border-stone-300 p-2 flex flex-col items-center justify-center bg-[#FAFAFA] hover:bg-stone-50 transition-colors cursor-pointer h-12 w-full text-center overflow-hidden" onClick={() => fileInputRef.current?.click()}>
                            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => {
                                if (e.target.files?.[0]) handleCropOpen('main', e.target.files[0]);
                                e.target.value = '';
                            }} />
                            {imageFile || prodImageUrl ? (
                                <div className="flex items-center gap-1 text-green-600">
                                    <CheckCircle className="w-4 h-4" /> <span className="text-[10px]">Eklendi</span>
                                </div>
                            ) : (
                                <div className="text-stone-400 flex items-center justify-center gap-1">
                                    <UploadCloud className="w-4 h-4 opacity-60" />
                                    <p className="text-[9px] uppercase tracking-widest mt-0.5">Seç</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1">
                        <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-1">Galeri</label>
                        <div className="border border-dashed border-stone-300 p-2 flex flex-col items-center justify-center bg-[#FAFAFA] hover:bg-stone-50 transition-colors cursor-pointer h-12 w-full text-center overflow-hidden" onClick={() => galleryInputRef.current?.click()}>
                            <input type="file" accept="image/*" className="hidden" ref={galleryInputRef} onChange={(e) => {
                                if (e.target.files?.[0]) handleCropOpen('gallery', e.target.files[0]);
                                e.target.value = '';
                            }} />
                            <div className="flex items-center justify-center gap-1 text-stone-400">
                                <ImageIcon className="w-4 h-4 opacity-60" />
                                <p className="text-[9px] uppercase tracking-widest mt-0.5 whitespace-nowrap">Ekle ({prodGalleryUrls.length + galleryFiles.length})</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KİLİT NOKTA: py-2 ve px-1 ile butonlara nefes alacak boşluk (padding) verildi */}
                {(imageFile || prodImageUrl || prodGalleryUrls.length > 0 || galleryFiles.length > 0) && (
                    <div className="flex gap-3 overflow-x-auto py-2 px-1 scrollbar-premium shrink-0">

                        {(imageFile || prodImageUrl) && (
                            <div className="relative w-12 h-12 bg-stone-100 rounded border-2 border-[#966842] shrink-0 group">
                                <img src={imageFile ? URL.createObjectURL(imageFile) : prodImageUrl} className="w-full h-full object-cover rounded" />
                                <span className="absolute bottom-0 inset-x-0 bg-[#966842] text-white text-[7px] text-center font-bold tracking-widest py-0.5">KAPAK</span>
                                <button type="button" onClick={(e) => { e.stopPropagation(); setImageFile(null); setProdImageUrl(""); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md">
                                    <X className="w-3 h-3" strokeWidth={2.5} />
                                </button>
                            </div>
                        )}

                        {prodGalleryUrls.map((url, index) => (
                            <div key={`old-${index}`} className="relative w-12 h-12 bg-stone-100 rounded border border-stone-200 shrink-0 group">
                                <img src={url} alt="" className="w-full h-full object-cover rounded" />
                                <button type="button" onClick={(e) => { e.stopPropagation(); setProdGalleryUrls(prev => prev.filter((_, i) => i !== index)); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md">
                                    <X className="w-3 h-3" strokeWidth={2.5} />
                                </button>
                            </div>
                        ))}

                        {galleryFiles.map((file, index) => (
                            <div key={`new-${index}`} className="relative w-12 h-12 bg-stone-100 rounded border-2 border-green-500 shrink-0 group">
                                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover rounded" />
                                <span className="absolute bottom-0 inset-x-0 bg-green-500 text-white text-[7px] text-center font-bold tracking-widest py-0.5">YENİ</span>
                                <button type="button" onClick={(e) => { e.stopPropagation(); setGalleryFiles(prev => prev.filter((_, i) => i !== index)); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md">
                                    <X className="w-3 h-3" strokeWidth={2.5} />
                                </button>
                            </div>
                        ))}

                    </div>
                )}

                <div className="flex flex-col gap-2 mt-auto pt-2 shrink-0">
                    <button disabled={isUploading} type="submit" className="w-full bg-[#966842] text-white py-2.5 text-xs uppercase tracking-widest font-medium hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-2 disabled:bg-stone-400 shadow-sm">
                        {isUploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Yükleniyor...</> : <>{editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {editingId ? "Güncelle" : "Vitrine Ekle"}</>}
                    </button>
                    {editingId && (
                        <button disabled={isUploading} type="button" onClick={cancelEditing} className="w-full bg-stone-200 text-stone-600 py-2 text-xs uppercase tracking-widest font-medium hover:bg-stone-300 transition-colors flex items-center justify-center gap-2">
                            <X className="w-4 h-4" /> İptal Et
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}