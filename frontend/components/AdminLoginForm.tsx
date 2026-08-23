"use client";

import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { playfair } from '@/app/fonts';
import { Lock, KeyRound, ArrowRight } from 'lucide-react';

export default function AdminLoginForm() {
    const { handleLogin, loginError } = useAdmin();
    const [passwordInput, setPasswordInput] = useState("");

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleLogin(passwordInput);
    };

    return (
        <main className="fixed inset-0 z-50 overflow-y-auto bg-[#F5F5F5] flex flex-col items-center justify-center px-4">
            <div className="bg-white p-10 md:p-14 shadow-2xl border border-stone-200 w-full max-w-md flex flex-col items-center text-center rounded-sm">
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-stone-100">
                    <Lock className="w-10 h-10 text-[#966842]" strokeWidth={1.5} />
                </div>
                <h1 className={`${playfair.className} text-3xl text-[#2A2A2A] mb-3 tracking-wide`}>Yönetim Paneli</h1>
                <p className="text-stone-500 text-sm font-light mb-10">Lütfen yetkili erişim parolasını giriniz.</p>
                <form onSubmit={onSubmit} className="w-full flex flex-col gap-6">
                    <div className="relative">
                        <KeyRound className={`absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 transition-colors duration-300 ${passwordInput.length > 0 ? 'text-[#966842]' : 'text-stone-400'}`} strokeWidth={1.5} />
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder="Parola"
                            className={`w-full border-2 py-4 pl-14 pr-4 text-xl text-stone-900 tracking-[0.3em] font-bold placeholder:tracking-normal placeholder:font-normal placeholder:text-stone-400 placeholder:text-sm focus:outline-none transition-all shadow-inner ${loginError ? 'border-red-400 focus:border-red-500 bg-red-50 text-red-600' : 'border-stone-200 bg-stone-50 focus:bg-white focus:border-[#966842]'}`}
                        />
                        {loginError && <p className="text-red-500 text-xs mt-2 text-left absolute -bottom-6 left-0 font-medium tracking-wide">Hatalı parola, lütfen tekrar deneyin.</p>}
                    </div>
                    <button type="submit" className="w-full bg-[#2A2A2A] text-white py-4 text-sm uppercase tracking-widest font-medium hover:bg-[#966842] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 mt-4">
                        Giriş Yap <ArrowRight className="w-5 h-5" />
                    </button>
                </form>
                <a href="/" className="mt-10 text-xs text-stone-400 hover:text-[#2A2A2A] tracking-wider uppercase underline underline-offset-4 transition-colors">Siteye Geri Dön</a>
            </div>
        </main>
    );
}