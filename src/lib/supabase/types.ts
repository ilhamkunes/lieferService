export type Category = {
  id: string;
  isim: string;
  sira: number;
};

export type Product = {
  id: string;
  kategori_id: string;
  isim: string;
  aciklama: string | null;
  fiyat: number;
  fotograf_url: string | null;
  alerjenler: string[];
  katki_maddeleri: string[];
  mevcut_mu: boolean;
  sira: number;
};

export type OpeningHour = {
  gun: number; // 0 = Pazar ... 6 = Cumartesi (JS Date.getDay() ile ayni)
  acilis: string; // "HH:MM:SS"
  kapanis: string; // "HH:MM:SS"
  kapali: boolean;
};
