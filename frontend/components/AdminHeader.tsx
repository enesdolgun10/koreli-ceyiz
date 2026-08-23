"use client";

import { playfair } from '@/app/fonts';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

export default function AdminHeader() {
    const { handleLogout } = useAdmin();

    return (
        <header className="bg-[#2A2A2A] text-white py-3 shadow-md z-10 shrink-0">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-5 h-5 text-[#966842]" />
                    <h1 className={`${playfair.className} text-xl tracking-widest`}>
                        KORELİ ÇEYİZ <span className="text-[#966842] font-light italic">YÖNETİM</span>
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleLogout} 
                        className="text-xs tracking-widest uppercase text-red-400 hover:text-white hover:bg-red-500/20 hover:border-red-500 transition-all border border-red-500/30 px-3 py-1.5 rounded-sm flex items-center gap-1.5 cursor-pointer font-medium"
                    >
                        <LogOut className="w-3.5 h-3.5" /> Oturumu Kapat
                    </button>
                    <a href="/" className="text-xs tracking-widest uppercase hover:text-[#966842] transition-colors border border-stone-600 px-3 py-1.5 rounded-sm">
                        Siteye Dön
                    </a>
                </div>
            </div>
        </header>
    );
}