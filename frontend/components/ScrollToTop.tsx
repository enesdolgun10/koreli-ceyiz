"use client";

import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Sayfa 300 piksel aşağı kaydırıldığında butonu görünür yap
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Pürüzsüz yukarı kayma efekti
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 z-50 bg-[#2A2A2A] text-white p-3 rounded-sm shadow-xl border border-stone-800/50 transition-all duration-500 transform hover:bg-[#966842] hover:-translate-y-1 ${isVisible
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
            aria-label="En üste çık"
        >
            <ChevronUp className="w-5 h-5" strokeWidth={1.5} />
        </button>
    );
}