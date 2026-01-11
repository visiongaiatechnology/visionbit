import * as bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import ecc from '@bitcoinerlab/secp256k1'; // Pure JS Implementation (No WASM)
import { Buffer } from 'buffer';

// Initialisiere die Elliptische Kurven Bibliothek (Pure JS)
const bip32 = BIP32Factory(ecc);
bitcoin.initEccLib(ecc);

export interface WalletResult {
  mnemonic: string;
  address: string;
  path: string;
  wif: string;
  xpub: string;
  created: string;
}

/**
 * Erstellt eine Wallet aus roher Entropie (Mausbewegungen + CSPRNG)
 */
export const generateWalletFromEntropy = async (entropyPool: number[], passphrase: string = ""): Promise<WalletResult> => {
  // 1. Mische die Maus-Entropie (User) mit window.crypto (System)
  const userEntropy = new Uint8Array(entropyPool);
  const systemEntropy = window.crypto.getRandomValues(new Uint8Array(32)); // 256 bits

  // Einfaches XOR Mixing für zusätzliche Sicherheit
  const finalEntropy = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    // Falls userEntropy kürzer/länger ist, nutzen wir Modulo
    const userByte = userEntropy.length > 0 ? userEntropy[i % userEntropy.length] : 0;
    finalEntropy[i] = systemEntropy[i] ^ userByte;
  }

  // 2. Generiere Mnemonic (BIP39) aus der gemixten Entropie
  const mnemonic = bip39.entropyToMnemonic(Buffer.from(finalEntropy));

  return deriveWalletFromMnemonic(mnemonic, passphrase);
};

/**
 * Leitet Wallet-Daten aus einem Mnemonic ab (Deterministic)
 */
export const deriveWalletFromMnemonic = async (mnemonic: string, passphrase: string): Promise<WalletResult> => {
  // 3. Seed generieren (mit optionaler Passphrase als Salt)
  const seed = await bip39.mnemonicToSeed(mnemonic, passphrase);

  // 4. Master Node ableiten (BIP32)
  const root = bip32.fromSeed(seed);

  // 5. Ableitungspfad für Native SegWit (BIP84) - Mainnet
  // m / purpose' / coin_type' / account' / change / address_index
  const path = "m/84'/0'/0'/0/0";
  const child = root.derivePath(path);

  // 6. Adresse generieren (bech32 / bc1q...)
  const { address } = bitcoin.payments.p2wpkh({
    pubkey: child.publicKey,
    network: bitcoin.networks.bitcoin,
  });

  if (!address) throw new Error("Adressgenerierung fehlgeschlagen");

  return {
    mnemonic,
    address,
    path,
    wif: child.toWIF(),
    xpub: root.neutered().toBase58(), // Master Public Key (für Watch-Only Wallets)
    created: new Date().toISOString()
  };
};