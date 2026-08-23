"use client";

import { useAdmin } from '@/context/AdminContext';
import { playfair } from '@/app/fonts';
import { AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal() {
    const { deleteModal, setDeleteModal, deleteCategory, deleteProduct } = useAdmin();

    if (!deleteModal.isOpen) return null;

    const confirmDelete = async () => {
        if (!deleteModal.id) return;

        if (deleteModal.type === 'product') {
            await deleteProduct(deleteModal.id);
        } else {
            await deleteCategory(deleteModal.id);
        }

        setDeleteModal({ isOpen: false, id: null, type: 'product', name: '' });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-stone-900/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white max-w-md w-full shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
                <div className="bg-red-50 flex justify-center py-6 border-b border-red-100">
                    <div className="bg-red-100 p-4 rounded-full">
                        <AlertTriangle className="w-8 h-8 text-red-500" strokeWidth={1.5} />
                    </div>
                </div>
                <div className="p-8 text-center flex flex-col items-center">
                    <h3 className={`${playfair.className} text-2xl text-stone-800 mb-2`}>Silme İşlemi Onayı</h3>
                    <p className="text-stone-500 text-sm leading-relaxed mb-1">
                        <span className="font-semibold text-stone-800">"{deleteModal.name}"</span> isimli {deleteModal.type === 'product' ? 'ürünü' : 'kategoriyi'} silmek üzeresiniz.
                    </p>
                </div>
                <div className="flex bg-stone-50 border-t border-stone-100 p-4 gap-4">
                    <button onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })} className="flex-1 bg-white border border-stone-200 text-stone-600 py-3 text-xs uppercase tracking-widest font-medium hover:bg-stone-100 transition-colors">
                        Vazgeç
                    </button>
                    <button onClick={confirmDelete} className="flex-1 bg-red-500 text-white py-3 text-xs uppercase tracking-widest font-medium hover:bg-red-600 shadow-md transition-colors">
                        Evet, Sil
                    </button>
                </div>
            </div>
        </div>
    );
}