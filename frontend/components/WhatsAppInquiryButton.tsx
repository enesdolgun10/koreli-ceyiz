'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

interface Props {
    productId: number;
    productName: string;
    whatsappNumber?: string;
    initialProductUrl: string;
}

export default function WhatsAppInquiryButton({
    productId,
    productName,
    whatsappNumber = "905426650749",
    initialProductUrl
}: Props) {
    const [finalUrl, setFinalUrl] = useState<string>(() => {
        const msg = encodeURIComponent(`Merhaba, sitenizdeki "${productName}" modeli hakkında detaylı bilgi ve fiyat almak istiyorum.\n\nÜrün Linki: ${initialProductUrl}`);
        return `https://wa.me/${whatsappNumber}?text=${msg}`;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const currentUrl = `${window.location.origin}/products/${productId}`;
            const msg = encodeURIComponent(`Merhaba, sitenizdeki "${productName}" modeli hakkında detaylı bilgi ve fiyat almak istiyorum.\n\nÜrün Linki: ${currentUrl}`);
            setFinalUrl(`https://wa.me/${whatsappNumber}?text=${msg}`);
        }
    }, [productId, productName, whatsappNumber]);

    return (
        <a
            href={finalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 text-white flex justify-center items-center gap-2 py-4 text-sm tracking-widest uppercase font-medium hover:bg-emerald-700 transition-colors mb-4 select-none"
        >
            <MessageCircle className="w-5 h-5" />
            WhatsApp'tan Bilgi Al
        </a>
    );
}
