import { playfair } from '@/app/fonts';
import Link from 'next/link';
import { MapPin, Clock, Compass } from 'lucide-react';
import { API_URL } from '@/utils/config';

async function getStoreSettings() {
    try {
        const res = await fetch(`${API_URL}/settings/`, { cache: 'no-store' });
        if (res.ok) {
            return await res.json();
        }
    } catch (error) {
        console.error("Mağaza ayarları yüklenemedi:", error);
    }
    return {
        working_hours_weekdays: "09:00 - 19:30",
        working_hours_sunday: "* Pazar günleri kapalıyız."
    };
}

export default async function StorePage() {
    const settings = await getStoreSettings();
    const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Koreli+%C3%87eyiz+Bal%C4%B1kesir";
    const weekdaysHours = settings.working_hours_weekdays || "09:00 - 19:30";
    const sundayHours = settings.working_hours_sunday || "* Pazar günleri kapalıyız.";

    return (
        <main className="bg-white min-h-screen pt-16 pb-24 text-stone-800">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <div className="text-xs font-medium tracking-[0.2em] text-stone-400 uppercase mb-8 text-center">
                    <Link href="/" className="hover:text-[#966842] transition-colors">Ana Sayfa</Link>
                    <span className="mx-2">/</span>
                    <span className="text-[#966842]">Mağazamız</span>
                </div>

                <div className="text-center flex flex-col items-center mb-16">
                    <h1 className={`${playfair.className} text-4xl md:text-5xl text-[#2A2A2A] mb-6`}>
                        Balıkesir Mağazamız
                    </h1>
                    <div className="w-12 h-[1px] bg-[#966842]"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-stretch mt-12">

                    {/* Sol Kısım: Bilgiler */}
                    <div className="bg-stone-50 p-8 md:p-12 flex flex-col justify-between border border-stone-100 rounded-sm">
                        <div className="space-y-8">
                            <div>
                                <span className="text-[#966842] tracking-[0.2em] uppercase text-xs font-semibold block mb-3">Konumumuz</span>
                                <h3 className={`${playfair.className} text-xl text-[#2A2A2A] mb-3`}>Sizi Kahveye Bekleriz</h3>
                                <p className="text-stone-500 font-light text-sm leading-relaxed flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-[#966842] shrink-0 mt-0.5" strokeWidth={1.5} />
                                    <span>Hisariçi, Orhan Pınar Sk. 11 B,<br />10010 Merkez / Balıkesir</span>
                                </p>
                            </div>

                            <div className="border-t border-stone-200/60 pt-6">
                                <span className="text-[#966842] tracking-[0.2em] uppercase text-xs font-semibold block mb-3">Çalışma Saatleri</span>
                                <p className="text-stone-500 font-light text-sm leading-relaxed flex items-start gap-3 mb-2">
                                    <Clock className="w-5 h-5 text-[#966842] shrink-0 mt-0.5" strokeWidth={1.5} />
                                    <span>Hafta İçi & Cumartesi:<br />{weekdaysHours}</span>
                                </p>
                                <p className="text-stone-400 font-light text-xs pl-8 italic">
                                    {sundayHours}
                                </p>
                            </div>
                        </div>

                        <div className="pt-8">
                            <a
                                href={googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-3 bg-[#2A2A2A] text-white px-8 py-4 text-xs font-medium tracking-widest uppercase hover:bg-[#966842] transition-colors w-full sm:w-auto shadow-sm"
                            >
                                <Compass className="w-4 h-4 animate-pulse" /> Yol Tarifi Al
                            </a>
                        </div>
                    </div>

                    {/* Sağ Kısım: Estetik Açıklama */}
                    <div className="flex flex-col justify-center border border-stone-100 p-8 md:p-12 relative overflow-hidden bg-[#FAFAFA]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#966842]/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
                        <h3 className={`${playfair.className} text-2xl text-[#2A2A2A] mb-6`}>Dokunarak Hissedin</h3>
                        <p className="text-stone-500 font-light text-sm leading-relaxed mb-6">
                            Koleksiyonlarımızın gerçek kalitesini, kumaş yumuşaklığını ve dantel işçiliklerinin asaletini tam anlamıyla deneyimlemeniz için sizleri Balıkesir Merkez'deki çarşı mağazamıza bekliyoruz.
                        </p>
                        <p className="text-stone-500 font-light text-sm leading-relaxed">
                            Gelin setleri, yatak örtüleri and ev tekstili ihtiyaçlarınızda sizlere rehberlik etmek, yatağınızın ölçülerine en uygun modelleri birlikte seçmek ve sıcak bir esnaf kahvesi eşliğinde çeyiz planlamanızı yapmak için buradayız.
                        </p>
                    </div>

                </div>

            </div>
        </main>
    );
}