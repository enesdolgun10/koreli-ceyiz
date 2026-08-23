import { playfair } from '@/app/fonts';
import Link from 'next/link';
import { MessageCircle, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
    const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Koreli+%C3%87eyiz+Bal%C4%B1kesir";

    // KİLİT NOKTA: WhatsApp linki yeni numaraya ayarlandı
    const whatsappLink = "https://wa.me/905078845423?text=Merhaba,%20sitenizden%20ulaşıyorum.%20Ürünler%20hakkında%20bilgi%20alabilir%20miyim?";

    return (
        <main className="bg-white min-h-screen pt-16 pb-24 text-stone-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-xs font-medium tracking-[0.2em] text-stone-400 uppercase mb-8 text-center">
                    <Link href="/" className="hover:text-[#966842] transition-colors">Ana Sayfa</Link>
                    <span className="mx-2">/</span>
                    <span className="text-[#966842]">İletişim</span>
                </div>

                <div className="text-center flex flex-col items-center mb-16">
                    <h1 className={`${playfair.className} text-4xl md:text-5xl text-[#2A2A2A] mb-6`}>
                        Bizimle İletişime Geçin
                    </h1>
                    <p className="text-stone-500 font-light text-sm max-w-md mx-auto">
                        Ürün çeşitlerimiz veya ürün detayları için bize dilediğiniz kanaldan hızlıca ulaşabilirsiniz.
                    </p>
                    <div className="w-12 h-[1px] bg-[#966842] mt-6"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch mt-12">

                    {/* WhatsApp */}
                    <div className="border border-stone-100 p-8 text-center flex flex-col items-center bg-[#FAFAFA] rounded-sm group hover:border-[#966842]/30 transition-colors">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-medium text-stone-800 mb-2">WhatsApp Destek Hattı</h3>
                        <p className="text-stone-400 text-xs font-light mb-6 flex-1">Fotoğraf göndererek hızlı bilgi almak ve sipariş planlamak için en pratik yol.</p>
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 text-white px-6 py-3 text-xs tracking-widest uppercase font-medium hover:bg-emerald-700 transition-colors w-full"
                        >
                            Mesaj Gönder
                        </a>
                    </div>

                    {/* Telefon */}
                    <div className="border border-stone-100 p-8 text-center flex flex-col items-center bg-[#FAFAFA] rounded-sm group hover:border-[#966842]/30 transition-colors">
                        <div className="w-12 h-12 bg-stone-100 text-[#966842] rounded-full flex items-center justify-center mb-6">
                            <Phone className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-base font-medium text-stone-800 mb-2">Telefonla Arayın</h3>
                        <p className="text-stone-400 text-xs font-light mb-6 flex-1">Mağaza çalışma saatleri içerisinde bizi doğrudan hattımızdan arayabilirsiniz.</p>
                        {/* KİLİT NOKTA: Direkt arama linki (tel:) eklendi */}
                        <a
                            href="tel:+902662414585"
                            className="bg-[#2A2A2A] text-white px-6 py-3 text-xs tracking-widest uppercase font-medium hover:bg-[#966842] transition-colors w-full"
                        >
                            (0266) 241 45 85
                        </a>
                    </div>

                    {/* Adres */}
                    <div className="border border-stone-100 p-8 text-center flex flex-col items-center bg-[#FAFAFA] rounded-sm group hover:border-[#966842]/30 transition-colors md:col-span-2 lg:col-span-1">
                        <div className="w-12 h-12 bg-stone-100 text-[#966842] rounded-full flex items-center justify-center mb-6">
                            <MapPin className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-base font-medium text-stone-800 mb-2">Mağaza Adresi</h3>
                        <p className="text-stone-500 text-xs font-light mb-6 flex-1 leading-relaxed">Hisariçi, Orhan Pınar Sk. 11 B,<br />10010 Merkez / Balıkesir</p>
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-stone-300 text-stone-600 px-6 py-3 text-xs tracking-widest uppercase font-medium hover:bg-stone-50 transition-colors w-full"
                        >
                            Haritada Göster
                        </a>
                    </div>

                </div>
            </div>
        </main>
    );
}