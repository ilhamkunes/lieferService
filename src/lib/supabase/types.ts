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
  one_cikan: boolean;
};

export type OpeningHour = {
  gun: number; // 0 = Pazar ... 6 = Cumartesi (JS Date.getDay() ile ayni)
  acilis: string; // "HH:MM:SS"
  kapanis: string; // "HH:MM:SS"
  kapali: boolean;
};

export type CustomerAddress = {
  id: string;
  musteri_id: string;
  etiket: string;
  sokak: string;
  numara: string;
  posta_kodu: string;
  sehir: string;
  kapi_kat_notu: string | null;
};

export type CustomerOrder = {
  id: string;
  siparis_no: string;
  tur: "teslimat" | "gelal";
  odeme_durumu: "bekliyor" | "odendi" | "basarisiz";
  siparis_durumu: string;
  toplam: number;
  created_at: string;
};

export type SiparisDurumu =
  | "yeni"
  | "hazirlaniyor"
  | "teslime_hazir"
  | "tamamlandi"
  | "reddedildi";

export type AdminOrder = {
  id: string;
  siparis_no: string;
  musteri_adi: string;
  telefon: string;
  eposta: string;
  tur: "teslimat" | "gelal";
  sokak: string | null;
  numara: string | null;
  posta_kodu: string | null;
  sehir: string | null;
  kapi_kat_notu: string | null;
  alma_saati: string | null;
  odeme_yontemi: "paypal" | "nakit_veya_kart";
  odeme_durumu: "bekliyor" | "odendi" | "basarisiz";
  siparis_durumu: SiparisDurumu;
  tahmini_hazir_saat: string | null;
  ara_toplam: number;
  teslimat_ucreti: number;
  toplam: number;
  not_metni: string | null;
  red_sebebi: string | null;
  created_at: string;
};

export type AdminOrderItem = {
  id: string;
  urun_adi: string;
  adet: number;
  birim_fiyat: number;
};

export type RestaurantSettings = {
  id: number;
  manuel_kapatma: boolean;
  teslimat_durduruldu: boolean;
  gelal_durduruldu: boolean;
  hazirlik_dakika: number;
  teslimat_dakika: number;
  kapak_foto_url: string | null;
  logo_url: string | null;
};

export type DeliveryZoneAdmin = {
  id: string;
  posta_kodu: string;
  teslimat_ucreti: number;
  minimum_siparis: number;
  aktif: boolean;
};
