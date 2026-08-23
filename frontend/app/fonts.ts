import { Playfair_Display, Montserrat } from "next/font/google";

// Elit başlık fontumuz (Playfair Display)
export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Premium genel yazı fontumuz (Montserrat)
export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});