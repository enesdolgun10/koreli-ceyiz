"use client";

import { ReactLenis, useLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

function ScrollReset() {
    const pathname = usePathname();
    const lenis = useLenis();

    useEffect(() => {
        if (lenis) {
            // Sayfa geçişindeki yukarı kaymayı da pamuk gibi yapsın diye süreyi 1.5 yaptık
            lenis.scrollTo(0, { immediate: false, duration: 1.5 });
        }
    }, [pathname, lenis]);

    return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    return (
        <ReactLenis root options={{
            // KİLİT NOKTA: duration ve easing'i sildik. 
            // lerp'i 0.04 gibi çok düşük bir değere aldık ki duruş çok daha uzun ve yumuşak olsun.
            lerp: 0.04,
            smoothWheel: true,
            wheelMultiplier: 0.9, // Hissiyatı biraz daha toklaştırmak için hızı %10 kıstık
            touchMultiplier: 2,
        }}>
            <ScrollReset />
            {children}
        </ReactLenis>
    );
}