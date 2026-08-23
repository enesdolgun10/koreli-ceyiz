import { playfair } from '@/app/fonts';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <main className="bg-white min-h-screen pt-16 pb-24 text-stone-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <div className="text-xs font-medium tracking-[0.2em] text-stone-400 uppercase mb-8 text-center">
                    <Link href="/" className="hover:text-[#966842] transition-colors">Ana Sayfa</Link>
                    <span className="mx-2">/</span>
                    <span className="text-[#966842]">Hakkımızda</span>
                </div>

                <div className="text-center flex flex-col items-center mb-16">
                    <h1 className={`${playfair.className} text-4xl md:text-5xl text-[#2A2A2A] mb-6`}>
                        Hikayemiz
                    </h1>
                    <div className="w-12 h-[1px] bg-[#966842]"></div>
                </div>

                <div className="prose prose-stone mx-auto font-light leading-relaxed text-stone-600 space-y-8 text-justify">
                    <p className="text-lg text-stone-800 italic font-normal text-center max-w-2xl mx-auto leading-relaxed mb-12">
                        "Kuşaktan kuşağa aktarılan geleneksel çeyiz kültürünü, modern zarafet ve kusursuz kaliteyle buluşturarak evlerinize değer katıyoruz."
                    </p>

                    <p>
                        Koreli Çeyiz olarak, yıllar önce samimi bir esnaflık bilinci ve kaliteye olan tutkumuzla çıktığımız bu yolda, bugün Balıkesir’in güvenilir ve köklü ev tekstili markalarından biri olmanın gururunu yaşıyoruz. Kuruluşumuzdan bu yana her bir ilmeğinde emek, her bir detayında özen barındıran en seçkin ürünleri sizlerin beğenisine sunuyoruz.
                    </p>

                    <p>
                        Evlilik hazırlığı yapan çiftlerin ve evini yenilemek isteyenlerin en heyecanlı anlarına ortak oluyor; yatak örtülerinden pike takımlarına, el emeği özel nakışlardan premium çeyiz paketlerine kadar geniş bir yelpazede hizmet veriyoruz. Bizim için çeyiz, yalnızca bir ev tekstili alışverişi değil; nesiller boyu yaşayacak anıların ve yuva sıcaklığının ilk adımıdır.
                    </p>

                    <h3 className={`${playfair.className} text-2xl text-[#2A2A2A] pt-4 font-medium text-center`}>
                        Vizyonumuz & Değerlerimiz
                    </h3>

                    <p>
                        Geleneksel motiflerin asaletini günümüzün modern tasarım çizgileriyle harmanlayarak, zamansız koleksiyonlar üretmeyi hedefliyoruz. Müşteri memnuniyetini en üst safhada tutan esnaf ahlakımızdan ödün vermeden, premium malzeme kalitesini bütçe dostu ve dürüst fiyat politikalarıyla buluşturuyoruz.
                    </p>

                    <p>
                        Koreli Çeyiz çatısı altında incelenen her kumaş, dokunulan her dantel ve hazırlanan her paket mağazamızın kalitesini ve kuşağımızın tecrübesini yansıtır. Güveniniz ve güler yüzünüz, bu güzel hikayeyi yarınlara taşımamızdaki en büyük motivasyon kaynağımızdır.
                    </p>
                </div>

            </div>
        </main>
    );
}