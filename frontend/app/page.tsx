import Link from 'next/link';
import { playfair } from '@/app/fonts';
import { ArrowRight } from 'lucide-react';
import HeroSlider from '@/components/HeroSlider';
import { API_URL } from '@/utils/config';

// API'den gelecek verilerin yapıları
type Product = { category_id: number };
type Category = {
  id: number;
  name: string;
  description?: string | null; // KİLİT NOKTA: API'den gelecek açıklama eklendi
  image_url?: string | null;
};

// TÜRKÇE KARAKTERLERİ URL FORMATINA ÇEVİREN OTOMATİK FONKSİYON
const generateSlug = (text: string) => {
  const trMap: { [key: string]: string } = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  };
  let slug = text;
  for (let key in trMap) {
    slug = slug.replace(new RegExp(key, 'g'), trMap[key]);
  }
  return slug.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
};

async function getActiveCategories() {
  try {
    const [prodRes, catRes] = await Promise.all([
      fetch(`${API_URL}/products/`, { cache: 'no-store' }),
      fetch(`${API_URL}/categories/`, { cache: 'no-store' })
    ]);

    if (!prodRes.ok || !catRes.ok) return [];

    const products: Product[] = await prodRes.json();
    const categories: Category[] = await catRes.json();

    // 1. Sadece içi dolu olan kategorileri bul
    const activeCatIds = Array.from(new Set(products.map(p => p.category_id)));

    // 2. Bu ID'lere sahip kategorileri süz ve vitrin verisini oluştur
    const activeCategories = categories
      .filter(cat => activeCatIds.includes(cat.id))
      .map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: generateSlug(cat.name),
        description: cat.description, // KİLİT NOKTA: Açıklama verisi frontend'e aktarıldı
        image_url: cat.image_url
      }));

    return activeCategories;
  } catch (error) {
    console.error("Kategoriler çekilemedi:", error);
    return [];
  }
}

export default async function Home() {
  const activeCategories = await getActiveCategories();

  return (
    <main className="bg-white min-h-screen">

      <HeroSlider />

      <section id="koleksiyonlar" className="w-full py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {activeCategories.length === 0 ? (
            <div className="text-center text-stone-400 font-light tracking-widest text-sm uppercase py-12">
              Vitrindeki ürünler güncelleniyor...
            </div>
          ) : (
            activeCategories.map((category, index) => {
              const isImageLeft = index % 2 === 0;

              return (
                <div
                  key={category.id}
                  className={`flex flex-col ${isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24 mb-32 last:mb-0`}
                >
                  <div className="w-full md:w-1/2">
                    <Link href={`/categories/${category.slug}`} className="block aspect-[4/5] bg-stone-100 relative overflow-hidden group shadow-sm">
                      {category.image_url ? (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                        />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-[#FAFAFA] transition-transform duration-[1.5s] group-hover:scale-105"></div>
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
                            <span className="text-stone-300 font-light tracking-widest text-sm uppercase text-center px-4">
                              {category.name} Görseli Bekleniyor
                            </span>
                          </div>
                        </>
                      )}
                    </Link>
                  </div>

                  <div className="w-full md:w-1/2 flex flex-col items-start">

                    {/* BAŞLIK RENGİNİ SİYAH (Antrasit) YAPTIK */}
                    <h2 className={`${playfair.className} text-4xl md:text-5xl text-[#2A2A2A] mb-6 leading-tight capitalize`}>
                      {category.name} <br /> Koleksiyonu
                    </h2>

                    {/* KİLİT NOKTA: Dinamik açıklama eklendi. Veri yoksa eski metne döner. */}
                    <p className="text-[#966842] font-light leading-relaxed mb-10 max-w-md">
                      {category.description || `Koreli Çeyiz mağazamızın en yeni sezon ${category.name.toLowerCase()} ürünlerini, kaliteden ödün vermeyen dokuları ve zarif detaylarıyla şimdi inceleyin.`}
                    </p>

                    <Link href={`/categories/${category.slug}`} className="group flex items-center gap-3 text-[#2A2A2A] hover:text-[#966842] transition-colors font-medium tracking-widest uppercase text-xs">
                      Koleksiyonu Gör <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}

        </div>
      </section>

    </main>
  );
}