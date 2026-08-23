"use client";

import { useState, useEffect } from 'react';
import { AdminProvider, useAdmin } from '@/context/AdminContext';
import AdminHeader from '@/components/AdminHeader';
import CategoryManager from '@/components/CategoryManager';
import ProductList from '@/components/ProductList';
import ProductForm from '@/components/ProductForm';
import AdminLoginForm from '@/components/AdminLoginForm';
import AdminToast from '@/components/AdminToast';
import ImageCropperModal from '@/components/modals/ImageCropperModal';
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal';
import StoreSettings from '@/components/StoreSettings';
import { Tags, List, Package, Store, Clock } from 'lucide-react';

function AdminPageContent() {
    const { isAuthenticated, editingId } = useAdmin();
    const [currentView, setCurrentView] = useState<'showcase' | 'store'>('showcase');
    const [activeTab, setActiveTab] = useState<'categories' | 'products' | 'form'>('products');

    // Ürün düzenleye tıklandığında (editingId değiştiğinde) otomatik olarak İşlemler (form) sekmesine geç
    useEffect(() => {
        if (editingId) {
            setCurrentView('showcase');
            setActiveTab('form');
        }
    }, [editingId]);

    if (!isAuthenticated) {
        return <AdminLoginForm />;
    }

    return (
        <main className="fixed inset-0 z-50 flex flex-col bg-[#F5F5F5] text-stone-800 overflow-hidden">

            <AdminHeader />

            {/* Üst Görünüm Seçici (Sub-header Navbar) */}
            <div className="bg-white border-b border-stone-200 py-2.5 px-4 shrink-0 shadow-sm z-10">
                <div className="max-w-[1700px] mx-auto flex items-center justify-between">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentView('showcase')}
                            className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 border cursor-pointer ${
                                currentView === 'showcase'
                                    ? 'bg-[#966842] border-[#966842] text-white shadow-sm font-semibold'
                                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                            }`}
                        >
                            <Store className="w-3.5 h-3.5" /> Vitrin Yönetimi
                        </button>
                        <button
                            onClick={() => setCurrentView('store')}
                            className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 border cursor-pointer ${
                                currentView === 'store'
                                    ? 'bg-[#966842] border-[#966842] text-white shadow-sm font-semibold'
                                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                            }`}
                        >
                            <Clock className="w-3.5 h-3.5" /> Mağaza Ayarları
                        </button>
                    </div>
                    {currentView === 'showcase' && (
                        <div className="hidden md:flex text-stone-400 text-[10px] uppercase tracking-widest font-medium">
                            Ürün ve Kategori Vitrin Yönetimi
                        </div>
                    )}
                    {currentView === 'store' && (
                        <div className="hidden md:flex text-stone-400 text-[10px] uppercase tracking-widest font-medium">
                            Mağaza Çalışma Saatleri Yapılandırması
                        </div>
                    )}
                </div>
            </div>

            {currentView === 'showcase' && (
                <div className="flex xl:hidden bg-white border-b border-stone-200 shrink-0 shadow-sm z-10">
                    <button onClick={() => setActiveTab('categories')} className={`flex-1 py-4 flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === 'categories' ? 'border-[#966842] text-[#966842] bg-stone-50' : 'border-transparent text-stone-400 hover:text-stone-600'}`}>
                        <Tags className="w-5 h-5 mb-0.5" /> Kategoriler
                    </button>
                    <button onClick={() => setActiveTab('products')} className={`flex-1 py-4 flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === 'products' ? 'border-[#966842] text-[#966842] bg-stone-50' : 'border-transparent text-stone-400 hover:text-stone-600'}`}>
                        <List className="w-5 h-5 mb-0.5" /> Vitrin
                    </button>
                    <button onClick={() => setActiveTab('form')} className={`flex-1 py-4 flex flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === 'form' ? 'border-[#966842] text-[#966842] bg-stone-50' : 'border-transparent text-stone-400 hover:text-stone-600'}`}>
                        <Package className="w-5 h-5 mb-0.5" /> İşlemler
                    </button>
                </div>
            )}

            {/* KİLİT NOKTA: mt-6 ve pb-6 boşlukları mt-4 ve pb-4 olarak küçültüldü */}
            <div className="flex-1 w-full max-w-[1700px] mx-auto px-0 sm:px-6 lg:px-8 xl:mt-4 xl:pb-4 flex flex-col min-h-0 relative">

                {currentView === 'showcase' ? (
                    <>
                        {/* MASAÜSTÜ: gap-6 yerine gap-4 kullanıldı */}
                        <div className="hidden xl:grid grid-cols-12 gap-4 flex-1 min-h-0">

                            <div className="col-span-3 h-full flex flex-col min-h-0">
                                <CategoryManager />
                            </div>

                            <div className="col-span-5 h-full flex flex-col min-h-0">
                                <ProductList />
                            </div>

                            <div className="col-span-4 h-full flex flex-col min-h-0">
                                <ProductForm />
                            </div>
                        </div>

                        <div data-lenis-prevent className="xl:hidden flex-1 p-4 pb-24 overflow-y-auto scrollbar-premium">
                            {activeTab === 'categories' && <CategoryManager />}
                            {activeTab === 'products' && <ProductList />}
                            {activeTab === 'form' && <ProductForm />}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 p-4 overflow-y-auto scrollbar-premium flex items-center justify-center">
                        <StoreSettings />
                    </div>
                )}

            </div>

            <AdminToast />
            <DeleteConfirmModal />
            <ImageCropperModal />

        </main>
    );
}

export default function AdminPanel() {
    useEffect(() => {
        // Sayfa genelindeki kaydırmayı engelle ve tarayıcı scrollbar'ını gizle
        const originalHtmlOverflow = document.documentElement.style.overflow;
        const originalBodyOverflow = document.body.style.overflow;
        
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.documentElement.style.overflow = originalHtmlOverflow;
            document.body.style.overflow = originalBodyOverflow;
        };
    }, []);

    return (
        <AdminProvider>
            <AdminPageContent />
        </AdminProvider>
    );
}