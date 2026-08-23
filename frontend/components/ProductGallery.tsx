"use client";

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

type Props = {
    mainImage?: string | null;
    galleryUrls?: string[];
    productName: string;
};

export default function ProductGallery({ mainImage, galleryUrls = [], productName }: Props) {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const images = [mainImage, ...galleryUrls].filter(Boolean) as string[];

    const [zoomProps, setZoomProps] = useState({ x: 50, y: 50, isHovered: false });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomProps({ x, y, isHovered: true });
    };

    if (images.length === 0) {
        return (
            <div className="aspect-[3/4] bg-[#FAFAFA] border border-stone-100 flex items-center justify-center">
                <span className="text-stone-400 text-xs tracking-widest uppercase">Görsel Bekleniyor</span>
            </div>
        );
    }

    return (
        // 1. KİLİT NOKTA: select-none ile çift tıklamada oluşan mavi seçim hatasını engelledik
        <div className="flex flex-col gap-3 select-none">

            {/* ÜST KISIM: ANA BÜYÜK FOTOĞRAF (CUSTOM ZOOM) */}
            <Swiper
                style={{
                    "--swiper-navigation-color": "#966842",
                } as React.CSSProperties}
                spaceBetween={10}
                navigation={true}
                loop={images.length > 1} // 2. KİLİT NOKTA: Sonsuz döngüyü aktif ettik, sona gelince başa saracak
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="w-full aspect-[3/4] bg-[#FAFAFA] rounded-sm overflow-hidden group"
            >
                {images.map((img, idx) => (
                    <SwiperSlide key={idx} className="flex items-center justify-center">
                        <div
                            className="relative w-full h-full overflow-hidden cursor-zoom-in"
                            onMouseMove={handleMouseMove}
                            onMouseEnter={() => setZoomProps(prev => ({ ...prev, isHovered: true }))}
                            onMouseLeave={() => setZoomProps(prev => ({ ...prev, isHovered: false }))}
                        >
                            <img
                                src={img}
                                alt={`${productName} - Görsel ${idx + 1}`}
                                // 3. KİLİT NOKTA: pointer-events-none ile fotoğrafın yanlışlıkla fareye yapışmasını/sürüklenmesini engelledik
                                className="w-full h-full object-cover transition-transform duration-200 ease-out pointer-events-none"
                                style={{
                                    transform: zoomProps.isHovered ? 'scale(1.8)' : 'scale(1)',
                                    transformOrigin: `${zoomProps.x}% ${zoomProps.y}%`
                                }}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* ALT KISIM: KÜÇÜK ÖNİZLEME FOTOĞRAFLARI (THUMBNAILS) */}
            {images.length > 1 && (
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="w-full"
                >
                    {images.map((img, idx) => (
                        <SwiperSlide
                            key={idx}
                            className="aspect-[3/4] cursor-pointer opacity-50 hover:opacity-100 transition-opacity [&.swiper-slide-thumb-active]:opacity-100 [&.swiper-slide-thumb-active]:border-2 [&.swiper-slide-thumb-active]:border-[#966842] rounded-sm overflow-hidden box-border"
                        >
                            <img src={img} alt={`Önizleme ${idx + 1}`} className="w-full h-full object-cover pointer-events-none" />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
}