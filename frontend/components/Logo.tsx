import { playfair } from '@/app/fonts';

export default function Logo({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>

            {/* SOL TARAF: Kendi Yüklediğin PNG Görsel */}
            <img
                src="/logo.png"
                alt="Koreli Çeyiz Amblem"
                className="h-10 w-auto object-contain" // Görselin boyutunu buradaki h-10 (height) ile büyütebilir (h-12, h-14) veya küçültebilirsin (h-8)
            />

            {/* SAĞ TARAF: Marka Yazısı */}
            <div className={`flex flex-col justify-center ${playfair.className}`}>
                <span className="text-[1.3rem] leading-none text-[#2A2A2A] font-semibold tracking-wider uppercase">
                    KORELİ
                </span>
                <span className="text-[0.65rem] leading-none text-[#966842] font-light tracking-[0.3em] mt-1 ml-0.5 uppercase">
                    Çeyiz
                </span>
            </div>

        </div>
    );
}