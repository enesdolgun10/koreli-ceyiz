"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type FavoritesContextType = {
    favorites: number[];
    toggleFavorite: (id: number) => void;
    syncFavorites: (validIds: number[]) => void; // YENİ: Senkronizasyon tipi
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<number[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('koreli_favorites');
        if (saved) {
            try {
                setFavorites(JSON.parse(saved));
            } catch (e) {
                console.error("Favori verisi okunamadı:", e);
            }
        }
    }, []);

    const toggleFavorite = (id: number) => {
        setFavorites(prev => {
            const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
            localStorage.setItem('koreli_favorites', JSON.stringify(next));
            return next;
        });
    };

    // YENİ: Hayalet verileri temizleyen senkronizasyon fonksiyonu
    const syncFavorites = (validIds: number[]) => {
        setFavorites(validIds);
        localStorage.setItem('koreli_favorites', JSON.stringify(validIds));
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, syncFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
    return context;
}