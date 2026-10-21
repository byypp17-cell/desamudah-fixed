// Pembungkus localStorage yang aman: tidak akan membuat aplikasi crash
// saat storage penuh (quota), diblokir (mode privat / in-app browser), atau datanya rusak.

export const safeGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const safeSet = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn(`[storage] Gagal menyimpan "${key}"`, err);
  }
};

export const safeRemove = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    /* abaikan */
  }
};

export const loadJSON = <T,>(key: string, fallback: T): T => {
  const raw = safeGet(key);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    safeRemove(key); // data rusak -> buang, pakai data awal
    return fallback;
  }
};

export const saveJSON = (key: string, value: unknown): void => {
  try {
    safeSet(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[storage] Gagal serialisasi "${key}"`, err);
  }
};
