/**
 * SECURE STORAGE ENGINE
 * ---------------------
 * Implementiert militärische Verschlüsselung (AES-256-GCM) für RAM-Daten.
 * Nutzt PBKDF2 für die Schlüsselableitung aus Passwörtern.
 * Speichert verschlüsselte Blobs im LocalStorage.
 */

export interface EncryptedContainer {
  ciphertext: string; // Base64
  iv: string;         // Base64 (Initialisierungsvektor)
  salt: string;       // Base64 (PBKDF2 Salt)
}

const STORAGE_KEY = "VISIOBIT_SECURE_VAULT_V1";

// Konfiguration für maximale Sicherheit
const ALGORITHM = { name: "AES-GCM", length: 256 };
const KDF_ITERATIONS = 500000; // Sehr hoch für Brute-Force-Resistenz
const HASH = "SHA-256";

/**
 * Generiert ein kryptografisch sicheres Passwort
 */
export const generateStrongPassword = (length: number = 24): string => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array)
    .map(x => charset[x % charset.length])
    .join('');
};

/**
 * Hilfsfunktion: ArrayBuffer zu Base64 String
 */
const bufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

/**
 * Hilfsfunktion: Base64 String zu Uint8Array
 */
const base64ToBytes = (base64: string): Uint8Array => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

/**
 * Leitet einen AES-Key aus einem Passwort ab (PBKDF2)
 */
const deriveKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as BufferSource, // Explicit Cast for TS Strict Mode
      iterations: KDF_ITERATIONS,
      hash: HASH
    },
    keyMaterial,
    ALGORITHM,
    false,
    ["encrypt", "decrypt"]
  );
};

/**
 * Verschlüsselt Daten mit AES-256-GCM
 */
export const encryptData = async (text: string, password: string): Promise<EncryptedContainer> => {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV für GCM
  
  const key = await deriveKey(password, salt);
  const enc = new TextEncoder();

  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv as BufferSource // Explicit Cast for TS Strict Mode
    },
    key,
    enc.encode(text)
  );

  return {
    ciphertext: bufferToBase64(encryptedContent),
    iv: bufferToBase64(iv.buffer),
    salt: bufferToBase64(salt.buffer)
  };
};

/**
 * Entschlüsselt Daten
 */
export const decryptData = async (container: EncryptedContainer, password: string): Promise<string> => {
  const salt = base64ToBytes(container.salt);
  const iv = base64ToBytes(container.iv);
  const ciphertext = base64ToBytes(container.ciphertext);

  const key = await deriveKey(password, salt);

  try {
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv as BufferSource // Explicit Cast
      },
      key,
      ciphertext as BufferSource // Explicit Cast for TS Strict Mode
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedContent);
  } catch (e) {
    throw new Error("Falsches Passwort oder korrupte Daten.");
  }
};

/**
 * Persistenz-Layer: Speichert den verschlüsselten Container im Browser
 */
export const saveVaultToStorage = (container: EncryptedContainer) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(container));
    return true;
  } catch (e) {
    console.error("Storage Limit exceeded or denied", e);
    return false;
  }
};

/**
 * Persistenz-Layer: Lädt den Container
 */
export const loadVaultFromStorage = (): EncryptedContainer | null => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as EncryptedContainer;
  } catch (e) {
    return null;
  }
};

/**
 * Persistenz-Layer: Löscht den Tresor
 */
export const clearVaultStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Prüft ob ein Tresor existiert
 */
export const hasSavedVault = (): boolean => {
  return !!localStorage.getItem(STORAGE_KEY);
};