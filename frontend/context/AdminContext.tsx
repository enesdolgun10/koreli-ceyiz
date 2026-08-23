"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { API_URL, SUPABASE_URL, SUPABASE_ANON_KEY } from '@/utils/config';

export type Category = {
    id: number;
    name: string;
    description?: string | null;
    image_url?: string | null;
};

export type Product = {
    id: number;
    name: string;
    price: number;
    old_price?: number | null;
    image_url?: string | null;
    gallery_urls?: string[];
    category_id: number;
    description?: string;
};

type ToastType = { message: string, type: 'success' | 'error' } | null;

interface AdminContextType {
    categories: Category[];
    products: Product[];

    // Fotoğraf State'leri (Merkezi Yönetim)
    catImageFile: File | null;
    setCatImageFile: (file: File | null) => void;
    imageFile: File | null;
    setImageFile: (file: File | null) => void;
    galleryFiles: File[];
    setGalleryFiles: (files: File[] | ((prev: File[]) => File[])) => void;

    addCategory: (name: string, description: string | null) => Promise<boolean>;
    deleteCategory: (id: number) => Promise<void>;
    addProduct: (prod: Omit<Product, 'id'>) => Promise<boolean>;
    updateProduct: (id: number, prod: Omit<Product, 'id'>) => Promise<boolean>;
    deleteProduct: (id: number) => Promise<void>;

    isAuthenticated: boolean;
    handleLogin: (password: string) => void;
    handleLogout: () => void;
    loginError: boolean;
    setLoginError: (val: boolean) => void;
    isUploading: boolean;
    editingId: number | null;
    setEditingId: (id: number | null) => void;
    toast: ToastType;
    showToast: (message: string, type: 'success' | 'error') => void;
    deleteModal: { isOpen: boolean, id: number | null, type: 'product' | 'category', name: string };
    setDeleteModal: (val: any) => void;
    fetchData: () => void;

    // Kırpma (Crop) Alanları
    handleCropOpen: (target: 'category' | 'main' | 'gallery', file: File) => void;
    handleCropComplete: (croppedFile: File) => void;
    cropModalOpen: boolean;
    setCropModalOpen: (val: boolean) => void;
    cropTarget: 'category' | 'main' | 'gallery' | null;
    imageSrc: string | null;
    crop: { x: number, y: number };
    setCrop: (val: any) => void;
    zoom: number;
    setZoom: (val: number) => void;
    croppedAreaPixels: any; // KİLİT NOKTA: Eksik olan arayüz tanımı eklendi
    setCroppedAreaPixels: (val: any) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function AdminProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [toast, setToast] = useState<ToastType>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: number | null, type: 'product' | 'category', name: string }>({
        isOpen: false,
        id: null,
        type: 'product',
        name: ''
    });
    // Merkezi Fotoğraf Dosya Havuzları
    const [catImageFile, setCatImageFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

    // Kırpma State'leri
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [cropTarget, setCropTarget] = useState<'category' | 'main' | 'gallery' | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchData = async () => {
        try {
            const [catRes, prodRes] = await Promise.all([
                fetch(`${API_URL}/categories/`),
                fetch(`${API_URL}/products/`)
            ]);
            if (catRes.ok) setCategories(await catRes.json());
            if (prodRes.ok) setProducts(await prodRes.json());
        } catch (error) {
            console.error(error);
            showToast("Veriler sunucudan çekilemedi.", "error");
        }
    };

    // Sayfa yüklendiğinde localStorage'dan token'ı geri yükle
    useEffect(() => {
        const savedToken = localStorage.getItem('admin_token');
        if (savedToken) {
            setToken(savedToken);
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) fetchData();
    }, [isAuthenticated]);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        setToken(null);
        setIsAuthenticated(false);
        showToast("Oturum kapatıldı.", "success");
    };

    const handleLogin = async (password: string) => {
        try {
            const res = await fetch(`${API_URL}/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('admin_token', data.token);
                setToken(data.token);
                setIsAuthenticated(true);
                setLoginError(false);
                showToast("Sisteme başarıyla giriş yapıldı.", "success");
            } else {
                setLoginError(true);
                showToast("Hatalı şifre, lütfen tekrar deneyin.", "error");
            }
        } catch (error) {
            console.error(error);
            setLoginError(true);
            showToast("Giriş yapılırken bir hata oluştu.", "error");
        }
    };

    // Kategori Ekleme
    const addCategory = async (name: string, description: string | null) => {
        setIsUploading(true);
        try {
            let finalCatImageUrl = null;

            if (catImageFile) {
                const fileExt = catImageFile.name.split('.').pop() || 'jpeg';
                const fileName = `category-${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, catImageFile);

                if (uploadError) {
                    showToast("Kategori resmi yüklenemedi: " + uploadError.message, "error");
                    setIsUploading(false);
                    return false;
                }
                finalCatImageUrl = supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl;
            }

            const tokenToUse = token || localStorage.getItem('admin_token');
            const res = await fetch(`${API_URL}/categories/`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenToUse}`
                },
                body: JSON.stringify({ name, description: description || null, image_url: finalCatImageUrl })
            });

            if (res.status === 401) {
                showToast("Oturum süresi doldu, lütfen tekrar giriş yapın.", "error");
                handleLogout();
                setIsUploading(false);
                return false;
            }

            if (res.ok) {
                fetchData();
                showToast("Yeni kategori başarıyla eklendi.", "success");
                setIsUploading(false);
                return true;
            } else {
                showToast("Kategori eklenirken hata oluştu.", "error");
                setIsUploading(false);
                return false;
            }
        } catch (error) {
            console.error("Kategori ekleme hatası:", error);
            showToast("Sunucuya şu an ulaşılamıyor.", "error");
            setIsUploading(false);
            return false;
        }
    };

    const deleteCategory = async (id: number) => {
        const tokenToUse = token || localStorage.getItem('admin_token');
        const res = await fetch(`${API_URL}/categories/${id}`, { 
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${tokenToUse}`
            }
        });
        if (res.status === 401) {
            handleLogout();
            return;
        }
        if (res.ok) { showToast("Kategori silindi.", "success"); fetchData(); }
        else { showToast("Kategori silinemedi (İçi dolu olabilir).", "error"); }
    };

    // Ürün Ekleme
    const addProduct = async (prod: Omit<Product, 'id'>) => {
        setIsUploading(true);
        let finalImageUrl = null;
        let finalGalleryUrls: string[] = [];

        if (imageFile) {
            const fileName = `product-${Date.now()}-${imageFile.name}`;
            const { error } = await supabase.storage.from('product-images').upload(fileName, imageFile);
            if (!error) finalImageUrl = supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl;
        }

        for (const file of galleryFiles) {
            const fileName = `gallery-${Date.now()}-${Math.random().toString(36).substring(7)}.jpeg`;
            const { error } = await supabase.storage.from('product-images').upload(fileName, file);
            if (!error) finalGalleryUrls.push(supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl);
        }

        const tokenToUse = token || localStorage.getItem('admin_token');
        const res = await fetch(`${API_URL}/products/`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenToUse}`
            },
            body: JSON.stringify({ ...prod, image_url: finalImageUrl, gallery_urls: finalGalleryUrls })
        });

        if (res.status === 401) {
            handleLogout();
            setIsUploading(false);
            return false;
        }

        if (res.ok) { showToast("Ürün eklendi.", "success"); fetchData(); setIsUploading(false); return true; }
        setIsUploading(false);
        return false;
    };

    // Ürün Güncelleme
    const updateProduct = async (id: number, prod: Omit<Product, 'id'>) => {
        setIsUploading(true);
        let finalImageUrl = prod.image_url || null;
        let finalGalleryUrls = [...(prod.gallery_urls || [])];

        if (imageFile) {
            const fileName = `product-${Date.now()}-${imageFile.name}`;
            const { error } = await supabase.storage.from('product-images').upload(fileName, imageFile);
            if (!error) finalImageUrl = supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl;
        }

        for (const file of galleryFiles) {
            const fileName = `gallery-${Date.now()}-${Math.random().toString(36).substring(7)}.jpeg`;
            const { error } = await supabase.storage.from('product-images').upload(fileName, file);
            if (!error) finalGalleryUrls.push(supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl);
        }

        const tokenToUse = token || localStorage.getItem('admin_token');
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenToUse}`
            },
            body: JSON.stringify({ ...prod, image_url: finalImageUrl, gallery_urls: finalGalleryUrls })
        });

        if (res.status === 401) {
            handleLogout();
            setIsUploading(false);
            return false;
        }

        if (res.ok) { showToast("Ürün güncellendi.", "success"); fetchData(); setIsUploading(false); return true; }
        setIsUploading(false);
        return false;
    };

    const deleteProduct = async (id: number) => {
        const tokenToUse = token || localStorage.getItem('admin_token');
        const res = await fetch(`${API_URL}/products/${id}`, { 
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${tokenToUse}`
            }
        });
        if (res.status === 401) {
            handleLogout();
            return;
        }
        if (res.ok) { showToast("Ürün silindi.", "success"); fetchData(); }
    };

    // Kırpma Akışları
    const handleCropOpen = (target: 'category' | 'main' | 'gallery', file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImageSrc(reader.result as string);
            setCropTarget(target);
            setCropModalOpen(true);
        };
    };

    const handleCropComplete = (croppedFile: File) => {
        if (cropTarget === 'category') setCatImageFile(croppedFile);
        if (cropTarget === 'main') setImageFile(croppedFile);
        if (cropTarget === 'gallery') setGalleryFiles(prev => [...prev, croppedFile]);
    };

    return (
        <AdminContext.Provider value={{
            categories, products, catImageFile, setCatImageFile, imageFile, setImageFile, galleryFiles, setGalleryFiles,
            addCategory, deleteCategory, addProduct, updateProduct, deleteProduct,
            isAuthenticated, handleLogin, handleLogout, loginError, setLoginError, isUploading, editingId, setEditingId, toast, showToast, deleteModal, setDeleteModal, fetchData,
            handleCropOpen, handleCropComplete, cropModalOpen, setCropModalOpen, cropTarget, imageSrc, crop, setCrop, zoom, setZoom, croppedAreaPixels, setCroppedAreaPixels
        }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (!context) throw new Error('useAdmin Context hatası!');
    return context;
}