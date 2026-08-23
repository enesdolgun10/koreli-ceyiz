import Link from 'next/link';
import { playfair } from '@/app/fonts';
import { HeartHandshake, BadgeCheck, Award, MapPin, Phone } from 'lucide-react';
import { API_URL } from '@/utils/config';

type Category = {
    id: number;
    name: string;
};

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

async function getFooterCategories() {
    try {
        const catRes = await fetch(`${API_URL}/categories/`, { cache: 'no-store' });
        if (!catRes.ok) return [];

        const categories: Category[] = await catRes.json();
        return categories;
    } catch (error) {
        console.error("Footer kategorileri çekilemedi:", error);
        return [];
    }
}

export default async function Footer() {
    const categories = await getFooterCategories();
    const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Koreli+%C3%87eyiz+Bal%C4%B1kesir";

    return (
        // KİLİT NOKTA: pt-16 yerine pt-10, pb-8 yerine pb-6 kullanıldı
        <footer className="bg-[#2A2A2A] pt-10 pb-6 border-t border-stone-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ÜST KISIM: Esnaf ve Mağaza Rozetleri */}
                {/* KİLİT NOKTA: pb-16 yerine pb-8 kullanıldı */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-stone-700/50 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <HeartHandshake className="w-6 h-6 text-[#966842]" strokeWidth={1.5} />
                        <h4 className="text-stone-200 text-sm tracking-widest uppercase">Güler Yüzlü Hizmet</h4>
                        <p className="text-stone-400 text-xs font-light">Samimi ve güvenilir alışveriş deneyimi</p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <BadgeCheck className="w-6 h-6 text-[#966842]" strokeWidth={1.5} />
                        <h4 className="text-stone-200 text-sm tracking-widest uppercase">Ayrıcalıklı Fiyatlar</h4>
                        <p className="text-stone-400 text-xs font-light">Kaliteli ürünler, bütçe dostu seçenekler</p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <Award className="w-6 h-6 text-[#966842]" strokeWidth={1.5} />
                        <h4 className="text-stone-200 text-sm tracking-widest uppercase">Yılların Tecrübesi</h4>
                        <p className="text-stone-400 text-xs font-light">Yirmi yılı aşkın kalite ve güven</p>
                    </div>
                </div>

                {/* ORTA KISIM: Linkler ve Mağaza Bilgileri */}
                {/* KİLİT NOKTA: py-16 yerine py-10 kullanıldı */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-10">

                    {/* Logo ve Hakkımızda */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className={`${playfair.className} text-2xl font-bold text-white tracking-widest flex items-center gap-2 mb-4`}>
                            KORELİ <span className="text-[#966842] font-light italic">ÇEYİZ</span>
                        </Link>
                        <p className="text-stone-400 text-sm font-light leading-relaxed mb-6">
                            Evinize değer katan kaliteli dokunuşlar. Yatak odasından mutfağa, en seçkin çeyiz paketleri ile mağazamızda hizmetinizdeyiz.
                        </p>
                        <div className="flex gap-6">
                            <a href="https://www.instagram.com/koreliceyiz/" className="text-stone-400 hover:text-[#966842] transition-colors text-xs font-medium tracking-[0.2em] uppercase">
                                Instagram
                            </a>
                            <a href="https://www.facebook.com/people/Koreli-C%CC%A7eyiz-Balikesir/100063934604745/" className="text-stone-400 hover:text-[#966842] transition-colors text-xs font-medium tracking-[0.2em] uppercase">
                                Facebook
                            </a>
                        </div>
                    </div>

                    {/* Koleksiyonlar */}
                    <div>
                        <h4 className="text-white text-sm tracking-widest uppercase mb-6 font-medium">Koleksiyonlar</h4>
                        <ul className="flex flex-col gap-3 text-sm font-light text-stone-400">
                            {categories.length === 0 ? (
                                <li>Vitrin güncelleniyor...</li>
                            ) : (
                                categories.map((cat) => (
                                    <li key={cat.id}>
                                        <Link
                                            href={`/categories/${generateSlug(cat.name)}`}
                                            className="hover:text-[#966842] transition-colors capitalize"
                                        >
                                            {cat.name.toLowerCase()}
                                        </Link>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>

                    {/* Kurumsal */}
                    <div>
                        <h4 className="text-white text-sm tracking-widest uppercase mb-6 font-medium">Kurumsal</h4>
                        <ul className="flex flex-col gap-3 text-sm font-light text-stone-400">
                            <li><Link href="/hakkimizda" className="hover:text-[#966842] transition-colors">Hakkımızda</Link></li>
                            <li><Link href="/magazamiz" className="hover:text-[#966842] transition-colors">Mağazamız</Link></li>
                            <li><Link href="/iletisim" className="hover:text-[#966842] transition-colors">İletişim</Link></li>
                        </ul>
                    </div>

                    {/* İletişim */}
                    <div>
                        <h4 className="text-white text-sm tracking-widest uppercase mb-6 font-medium">Mağazamıza Bekleriz</h4>

                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-400 text-sm font-light leading-relaxed mb-4 flex items-start gap-3 hover:text-white transition-colors cursor-pointer group"
                        >
                            <MapPin className="w-5 h-5 text-[#966842] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                            <span>Hisariçi, Orhan Pınar Sk. 11 B,<br />10010 Merkez / Balıkesir</span>
                        </a>

                        <a
                            href="tel:+902662414585"
                            className="text-stone-400 text-sm font-light leading-relaxed mb-4 flex items-center gap-3 hover:text-white transition-colors cursor-pointer group"
                        >
                            <Phone className="w-5 h-5 text-[#966842] shrink-0 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                            <span>(0266) 241 45 85</span>
                        </a>
                    </div>

                </div>

                {/* ALT KISIM: Telif Hakkı */}
                {/* KİLİT NOKTA: pt-8 yerine pt-6 kullanıldı */}
                <div className="pt-6 border-t border-stone-700/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500 font-light tracking-wider">
                    <p>© {new Date().getFullYear()} Koreli Çeyiz. Tüm hakları saklıdır.</p>
                    <a href="https://www.linkedin.com/in/enesdolgun10" target="_blank" rel="noopener noreferrer" className="text-stone-500 hover:text-white transition-colors">
                        Designed & Developed by Enes Dolgun
                    </a>
                </div>

            </div>
        </footer>
    );
}