"use client";

import { useAdmin } from '@/context/AdminContext';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export default function AdminToast() {
    const { toast } = useAdmin();

    if (!toast) return null;

    return (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded shadow-2xl z-[100] flex items-center gap-3 text-sm font-medium tracking-wide animate-fade-in-up ${toast.type === 'success' ? 'bg-[#2A2A2A] text-white' : 'bg-red-500 text-white'}`}>
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-[#966842]" /> : <AlertTriangle className="w-5 h-5" />}
            {toast.message}
        </div>
    );
}