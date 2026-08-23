import Link from 'next/link';
import { playfair } from '@/app/fonts';
import FavoriteButton from '@/components/FavoriteButton';
import { API_URL } from '@/utils/config';

type Product = {
    id: number;
    name: string;
    price: number;
    old_price?: number | null;
    category_id: number;
    image_url?: string;
};

// Sadece indirimli ürünleri getiren akıllı fonksiyon
async function getDiscountedProducts() {
    try {
        const res = await fetch(`${API_URL}/products/`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Veri çekilemedi');

        const allProducts: Product[] = await res.json();

        // FİLTRELEME: Sadece old_price değeri price'tan BÜYÜK olan ürünleri al
        const discountedProducts = allProducts.filter(
            p => p.old_price && p.old_price > p.price
        );

        return discountedProducts;
    } catch (error) {
        console.error("İndirimli ürünler çekilirken hata:", error);
        return [];
    }
}

export default async function AdvantageousProductsPage() {
    const products = await getDiscountedProducts();

    return (
        <main className="bg-white min-h-screen pt-12 pb-24">

            {/* --- ÜST KISIM --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center flex flex-col items-center">
                <div className="text-xs font-medium tracking-[0.2em] text-stone-400 uppercase mb-4 flex gap-2">
                    <Link href="/" className="hover:text-[#966842] transition-colors">Ana Sayfa</Link>
                    <span>/</span>
                    <span className="text-[#966842]">Fırsatlar</span>
                </div>
                <h1 className={`${playfair.className} text-4xl md:text-5xl text-[#2A2A2A] mb-4`}>
                    Avantajlı Ürünler
                </h1>
                <p className="text-stone-500 font-light text-sm max-w-xl mb-6">
                    Seçkin tasarımlarda, sınırlı süre için geçerli indirimleri kaçırmayın. Sizin için seçtiğimiz özel fırsatlar aşağıda listelenmiştir.
                </p>
                <div className="w-12 h-[1px] bg-[#966842]"></div>
            </div>

            {/* --- ÜRÜN IZGARASI --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {products.length === 0 ? (
                    <div className="text-center py-24 bg-[#FAFAFA] border border-stone-100">
                        <p className="text-stone-400 font-light tracking-widest text-sm uppercase">
                            Şu an aktif bir indirim kampanyamız bulunmamaktadır.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-16 md:gap-x-8">

                        {products.map((product) => {
                            const discountPercentage = Math.round(((product.old_price! - product.price) / product.old_price!) * 100);

                            return (
                                <Link href={`/products/${product.id}`} key={product.id} className="group cursor-pointer flex flex-col gap-5 relative">
                                    {/* Görsel Alanı */}
                                    <div className="relative aspect-[3/4] overflow-hidden bg-[#FAFAFA]">

                                        {/* İNDİRİM ROZETİ */}
                                        <div className="absolute top-4 left-4 z-20 bg-[#2A2A2A] text-white text-[9px] font-medium tracking-[0.2em] uppercase px-3 py-1 shadow-sm">
                                            % {discountPercentage} İndirim
                                        </div>

                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-stone-100 transition-transform duration-[1.5s] group-hover:scale-105"></div>
                                        )}

                                        {!product.image_url && (
                                            <div className="absolute inset-0 flex items-center justify-center text-stone-300 font-light tracking-widest text-xs uppercase z-10 text-center px-4">
                                                Görsel Bekleniyor
                                            </div>
                                        )}

                                        <FavoriteButton productId={product.id} variant="card" />

                                        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex justify-center">
                                            <span className="bg-white/90 backdrop-blur-sm text-[#2A2A2A] text-[10px] font-medium tracking-[0.2em] uppercase px-8 py-3 shadow-sm hover:bg-[#966842] hover:text-white transition-colors w-full text-center">
                                                Fırsatı İncele
                                            </span>
                                        </div>
                                    </div>

                                    {/* Ürün Bilgisi */}
                                    <div className="flex flex-col items-center text-center px-2">
                                        <h3 className="text-sm font-medium text-[#2A2A2A] tracking-wide mb-2 line-clamp-2 leading-relaxed">
                                            {product.name}
                                        </h3>

                                        <div className="flex items-center gap-2 justify-center">
                                            <span className="text-stone-400 text-xs font-normal line-through decoration-stone-300">
                                                {product.old_price!.toLocaleString('tr-TR')} TL
                                            </span>
                                            <span className="text-[#966842] text-sm font-semibold tracking-wider">
                                                {product.price.toLocaleString('tr-TR')} TL
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}

                    </div>
                )}
            </div>

        </main>
    );
}