"use client";

import { useAdmin } from '@/context/AdminContext';
import { playfair } from '@/app/fonts';
import { Crop, X } from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/utils/cropImage';

export default function ImageCropperModal() {
    const {
        cropModalOpen, setCropModalOpen,
        imageSrc, crop, setCrop, zoom, setZoom,
        croppedAreaPixels, setCroppedAreaPixels,
        handleCropComplete, showToast, cropTarget
    } = useAdmin();

    if (!cropModalOpen || !imageSrc) return null;

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const confirmCrop = async () => {
        try {
            if (imageSrc && croppedAreaPixels && cropTarget) {
                // Kırpma işlemini burada yapıp Context'e "al bu kırpılmış dosya" diyoruz
                const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, `koreli-${Date.now()}.jpeg`) as File;
                handleCropComplete(croppedFile);
                setCropModalOpen(false);
            }
        } catch (e) {
            console.error(e);
            showToast("Kırpma işlemi başarısız oldu.", "error");
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-stone-900/90 backdrop-blur-md">
            <div className="bg-white w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-[#FAFAFA]">
                    <h3 className={`${playfair.className} text-xl text-stone-800 flex items-center gap-2`}>
                        <Crop className="w-5 h-5 text-[#966842]" /> Vitrin Fotoğrafını Kırp
                    </h3>
                    <button onClick={() => setCropModalOpen(false)} className="text-stone-400 hover:text-red-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="relative w-full h-[400px] bg-stone-100">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={3 / 4}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                </div>
                <div className="p-6 bg-white flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-widest text-stone-500 font-medium">Yakınlaştır</label>
                        <input
                            type="range"
                            value={zoom}
                            min={1} max={3} step={0.1}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full accent-[#966842]"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => setCropModalOpen(false)} className="flex-1 bg-white border border-stone-200 text-stone-600 py-3 text-xs uppercase tracking-widest font-medium hover:bg-stone-100 transition-colors">
                            İptal
                        </button>
                        <button onClick={confirmCrop} className="flex-1 bg-[#966842] text-white py-3 text-xs uppercase tracking-widest font-medium hover:bg-[#2A2A2A] shadow-md transition-colors">
                            Kırp ve Onayla
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}