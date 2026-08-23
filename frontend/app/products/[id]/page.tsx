import Link from 'next/link';
import { playfair } from '@/app/fonts';
import { ChevronRight, MessageCircle, ShieldCheck, Truck, Undo2 } from 'lucide-react';
import ProductGallery from '@/components/ProductGallery';
import FavoriteButton from '@/components/FavoriteButton';
import BackButton from '@/components/BackButton';
import { API_URL, SITE_URL } from '@/utils/config';

type Product = {
    id: number;
    name: string;
    description?: string;
    price: number;
    old_price?: number | null;
    image_url?: string | null;
    gallery_urls?: string[];
    category_id: number;
};

type Category = {
    id: number;
    name: string;
};

type Props = {
    params: Promise<{ id: string }>;
};

async function getProductData(id: string) {
    try {
        const res = await fetch(`${API_URL}/products/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Ürün bulunamadı');
        const product: Product = await res.json();

        const catRes = await fetch(`${API_URL}/categories/`, { cache: 'no-store' });
        const categories: Category[] = catRes.ok ? await catRes.json() : [];
        const category = categories.find(c => c.id === product.category_id);

        return { product, categoryName: category?.name || "Kategori" };
    } catch (error) {
        console.error(error);
        return { product: null, categoryName: "" };
    }
}

export default async function ProductDetailPage({ params }: Props) {
    const resolvedParams = await params;
    const { product, categoryName } = await getProductData(resolvedParams.id);

    if (!product) {
        return (
            <main className="min-h-screen pt-32 text-center">
                <h1 className="text-2xl text-stone-800">Ürün bulunamadı.</h1>
                <Link href="/" className="text-[#966842] underline mt-4 inline-block">Ana Sayfaya Dön</Link>
            </main>
        );
    }

    // KİLİT NOKTA: Site yayına girince burayı kendi alan adınla değiştirmelisin (Örn: https://www.koreliceyiz.com)
    const domain = SITE_URL;
    const productUrl = `${domain}/products/${product.id}`;

    // KİLİT NOKTA: Mesajın içine ürün linki de eklendi
    const message = encodeURIComponent(`Merhaba, sitenizdeki "${product.name}" modeli hakkında detaylı bilgi ve fiyat almak istiyorum.\n\nÜrün Linki: ${productUrl}`);
    const whatsappNumber = "905078845423";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    return (
        <main className="bg-white min-h-screen pt-8 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <BackButton />

                <div className="flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] text-stone-400 uppercase mb-8">
                    <Link href="/" className="hover:text-[#966842] transition-colors">Ana Sayfa</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="cursor-default">{categoryName}</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-[#966842] truncate max-w-[200px]">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

                    <div className="w-full">
                        <ProductGallery
                            mainImage={product.image_url}
                            galleryUrls={product.gallery_urls}
                            productName={product.name}
                        />
                    </div>

                    <div className="flex flex-col pt-4 md:pt-10">

                        <div className="flex justify-between items-start gap-4 mb-2">
                            <h1 className={`${playfair.className} text-3xl md:text-4xl text-[#2A2A2A] leading-tight`}>
                                {product.name}
                            </h1>
                        </div>

                        <div className="w-12 h-[1px] bg-[#966842] mb-6"></div>

                        <div className="flex items-end gap-3 mb-8">
                            <span className="text-3xl font-semibold text-[#966842] tracking-wider">
                                {product.price.toLocaleString('tr-TR')} TL
                            </span>
                            {product.old_price && (
                                <span className="text-stone-400 text-lg line-through decoration-stone-300 mb-1">
                                    {product.old_price.toLocaleString('tr-TR')} TL
                                </span>
                            )}
                        </div>

                        <div className="prose prose-sm text-stone-500 font-light leading-relaxed mb-10">
                            <p>{product.description || "Bu ürün için henüz detaylı bir açıklama girilmemiştir. Kumaş ve işleme detayları için bizimle iletişime geçebilirsiniz."}</p>
                        </div>

                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-emerald-600 text-white flex justify-center items-center gap-2 py-4 text-sm tracking-widest uppercase font-medium hover:bg-emerald-700 transition-colors mb-4"
                        >
                            <MessageCircle className="w-5 h-5" />
                            WhatsApp'tan Bilgi Al
                        </a>

                        <FavoriteButton productId={product.id} variant="detail" />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-stone-100 pt-8 mt-auto">
                            <div className="flex flex-col items-center text-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-stone-300" strokeWidth={1.5} />
                                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-medium">Premium<br />Kalite</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <Truck className="w-6 h-6 text-stone-300" strokeWidth={1.5} />
                                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-medium">Güvenli<br />Teslimat</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <Undo2 className="w-6 h-6 text-stone-300" strokeWidth={1.5} />
                                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-medium">Müşteri<br />Memnuniyeti</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}