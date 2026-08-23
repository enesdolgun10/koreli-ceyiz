"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-stone-400 uppercase hover:text-[#966842] transition-colors mb-6 group w-fit"
        >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            Geri Dön
        </button>
    );
}