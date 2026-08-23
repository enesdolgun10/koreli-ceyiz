"use client";

import { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { playfair } from '@/app/fonts';
import { Clock, Save, Loader2 } from 'lucide-react';
import { API_URL } from '@/utils/config';

export default function StoreSettings() {
    const { showToast } = useAdmin();
    const [weekdays, setWeekdays] = useState("");
    const [sunday, setSunday] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${API_URL}/settings/`, { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setWeekdays(data.working_hours_weekdays || "09:00 - 19:30");
                    setSunday(data.working_hours_sunday || "* Pazar günleri kapalıyız.");
                }
            } catch (error) {
                console.error("Ayarlar yüklenemedi:", error);
                showToast("Mağaza ayarları sunucudan çekilemedi.", "error");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, [showToast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!weekdays.trim()) {
            showToast("Hafta içi & Cumartesi çalışma saatleri boş olamaz.", "error");
            return;
        }

        setIsSaving(true);
        try {
            const tokenToUse = localStorage.getItem('admin_token');
            const res = await fetch(`${API_URL}/settings/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenToUse}`
                },
                body: JSON.stringify({
                    working_hours_weekdays: weekdays.trim(),
                    working_hours_sunday: sunday.trim()
                })
            });

            if (res.ok) {
                showToast("Mağaza ayarları başarıyla güncellendi.", "success");
            } else {
                showToast("Ayarlar güncellenirken hata oluştu.", "error");
            }
        } catch (error) {
            console.error("Ayarlar kaydedilemedi:", error);
            showToast("Bağlantı hatası: Ayarlar kaydedilemedi.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white p-8 shadow-sm border border-stone-200 w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[300px]">
                <Loader2 className="w-8 h-8 text-[#966842] animate-spin mb-4" />
                <p className="text-stone-500 font-light text-sm tracking-wide">Ayarlar Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div data-lenis-prevent className="bg-white p-6 md:p-8 shadow-sm border border-stone-200 w-full max-w-2xl mx-auto rounded-sm flex flex-col">
            <h2 className={`${playfair.className} text-xl font-medium flex items-center gap-2.5 mb-6 border-b pb-4 text-[#2A2A2A] shrink-0`}>
                <Clock className="w-5 h-5 text-[#966842]" />
                Mağaza Çalışma Saatleri Ayarı
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2 font-medium">Hafta İçi & Cumartesi Saatleri</label>
                    <input
                        type="text"
                        value={weekdays}
                        onChange={(e) => setWeekdays(e.target.value)}
                        placeholder="Örn: 09:00 - 19:30"
                        className="w-full border-2 border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-[#966842] focus:bg-white bg-stone-50 transition-all font-medium text-stone-800 rounded-sm"
                    />
                    <p className="text-stone-400 text-[11px] mt-1.5 font-light">Mağazanın hafta içi ve cumartesi günleri arasındaki aktif saatlerini belirtir.</p>
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2 font-medium">Pazar Günü Durumu</label>
                    <input
                        type="text"
                        value={sunday}
                        onChange={(e) => setSunday(e.target.value)}
                        placeholder="Örn: * Pazar günleri kapalıyız."
                        className="w-full border-2 border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-[#966842] focus:bg-white bg-stone-50 transition-all font-medium text-stone-800 rounded-sm"
                    />
                    <p className="text-stone-400 text-[11px] mt-1.5 font-light">Pazar gününe özel tatil veya çalışma durumu açıklama metni.</p>
                </div>

                <div className="flex justify-end pt-4 border-t border-stone-100">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-[#2A2A2A] text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-widest hover:bg-[#966842] transition-colors flex items-center justify-center gap-2.5 disabled:bg-stone-400 cursor-pointer shadow-sm rounded-sm"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Kaydediliyor...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Ayarları Kaydet
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
