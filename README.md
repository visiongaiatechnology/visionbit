# 🔐 VisionBit Secure Wallet

[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Bitcoin](https://img.shields.io/badge/Bitcoin-BIP--39%20%2F%20BIP--84-F7931A?style=for-the-badge&logo=bitcoin)](https://bitcoin.org)
[![Status](https://img.shields.io/badge/Status-DIAMANT-purple?style=for-the-badge)](#)
[![VGT](https://img.shields.io/badge/VGT-VisionGaia_Technology-red?style=for-the-badge)](https://visiongaiatechnology.de)
[![Donate](https://img.shields.io/badge/Donate-PayPal-00457C?style=for-the-badge&logo=paypal)](https://www.paypal.com/paypalme/dergoldenelotus)

> *"Not your keys, not your coins. Not your device, not your keys."*

**VisionBit** is a high-security, client-side Bitcoin Cold Wallet generator — built for air-gapped environments. No servers. No telemetry. No trust required.

Implements modern cryptographic standards (BIP-39, BIP-84) to generate private keys entirely offline, with physical entropy collection through mouse movement to eliminate browser RNG dependency.


## ⚠️ DISCLAIMER: EXPERIMENTAL R&D PROJECT

This project is a **Proof of Concept (PoC)** and part of ongoing research and development at
VisionGaia Technology. It is **not** a certified or production-ready product.

**Use at your own risk.** The software may contain security vulnerabilities, bugs, or
unexpected behavior. It may break your environment if misconfigured or used improperly.

**Do not deploy in critical production environments** unless you have thoroughly audited
the code and understand the implications. For enterprise-grade, verified protection,
we recommend established and officially certified solutions.

Found a vulnerability or have an improvement? **Open an issue or contact us.**


---

![VisionBit Interface](https://private-user-images.githubusercontent.com/31537456/534342407-983b0b83-4969-4785-ba5e-abe63865953f.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzM1MDQ2NzQsIm5iZiI6MTc3MzUwNDM3NCwicGF0aCI6Ii8zMTUzNzQ1Ni81MzQzNDI0MDctOTgzYjBiODMtNDk2OS00Nzg1LWJhNWUtYWJlNjM4NjU5NTNmLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjAzMTQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwMzE0VDE2MDYxNFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTg0OGNkZDRmOWM1NmIxMGIzMTljYTlmMTdiMzcyZWRiNGMxZjg1M2UyNWFlODFmNGFiNzQzMTk4MTU2NTE4N2MmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.GB4eYqAQ4QGLbD_J5zpeRbUnSS92PQ3xpVycegkRvNQ)

---

## 🚨 Why Most Wallet Generators Are Dangerous

Most online wallet generators silently send your private keys to remote servers — or depend entirely on the browser's built-in RNG, which can be predicted or manipulated in compromised environments.

| Standard Generator | VisionBit |
|---|---|
| ❌ Server-side key generation risk | ✅ 100% client-side execution |
| ❌ Browser RNG only (predictable) | ✅ Physical entropy via mouse movement |
| ❌ External CDN dependencies at runtime | ✅ Zero external dependencies in production |
| ❌ Keys stored in browser memory | ✅ Zero-Knowledge — reload wipes all data |
| ❌ Not designed for air-gap use | ✅ Offline-first, USB-deployable build |

---

## 🛡️ Security Architecture

VisionBit follows the principle: **"Don't Trust, Verify."**

### Client-Side Execution Only
Every cryptographic operation runs locally in your browser. No keys, no mnemonics, no addresses ever leave your machine.

### True Entropy Generation
VisionBit does not rely solely on `window.crypto`. It collects **physical entropy** through your mouse movements and mixes it into the entropy pool via XOR operations — making key generation resistant to browser RNG weaknesses.

### Offline-First Build System
The production build (`dist/`) is a fully self-contained static HTML/JS bundle. Copy it to a USB stick and run it on a machine that has never touched the internet.

### Zero-Knowledge Design
The app has no memory. Closing or reloading the browser tab destroys all sensitive data from RAM. Nothing is ever persisted.

---

## ✨ Features

| Feature | Standard | Description |
|---|---|---|
| **BIP-39** | ✅ | 24-word mnemonic generation (256-bit security) |
| **BIP-84** | ✅ | Native SegWit `bc1q...` addresses — lower fees |
| **BIP-39 Passphrase** | ✅ | Optional salt for plausible deniability |
| **HD Wallet** | ✅ | Hierarchical Deterministic key derivation `m/84'/0'/0'/0/0` |
| **Paper Wallet** | ✅ | Print-optimized view for physical key backup |
| **Air-Gap Ready** | ✅ | USB-deployable offline build |
| **Zero-Knowledge** | ✅ | Reload = full memory wipe |

---

## 📸 Screenshots

<p align="center">
  <img src="https://private-user-images.githubusercontent.com/31537456/534342482-372854e4-384a-4e0b-a4cc-7bfb53418112.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzM1MDQ2NzQsIm5iZiI6MTc3MzUwNDM3NCwicGF0aCI6Ii8zMTUzNzQ1Ni81MzQzNDI0ODItMzcyODU0ZTQtMzg0YS00ZTBiLWE0Y2MtN2JmYjUzNDE4MTEyLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjAzMTQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwMzE0VDE2MDYxNFomWC1BbXotU2lnbmF0dXJlPTFiOTJhYWUwZmM2YWU1ZWIxN2RiZTRiYjc3ZGMxNmI3YjE1N2ZhZjE5MDdiZTc5ODU0NDI1MDY2NGMxNDU1NmMmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.hRBUwXOlIgqkeuwA9ZyLXroltPELyRKJLxW5Z3j4AdU" width="48%" />
  <img src="https://private-user-images.githubusercontent.com/31537456/534342630-c8726d96-c557-4b2b-b29c-ac49816eb961.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzM1MDQ2NzQsIm5iZiI6MTc3MzUwNDM3NCwicGF0aCI6Ii8zMTUzNzQ1Ni81MzQzNDI2MzAtYzg3MjZkOTYtYzU1Ny00YjJiLWIyOWMtYWM0OTgxNmViOTYxLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjAzMTQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwMzE0VDE2MDYxNFomWC1BbXotU2lnbmF0dXJlPWI5NTJlNjQ2YjRlMDg1MzU0YmJiNGZlYjIwOWZjM2E1NjkwNGE3YjVjNzA1MDQzNzBkNjU0ZWJjNjM5NTUxNjEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.G34_27_eMqZRigT57g3shl2ipQ-wIcQ9mR6HdkqtDXE" width="48%" />
</p>

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + TypeScript (Strict) |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS |
| **Mnemonic** | `bip39` — BIP-39 standard |
| **Bitcoin Logic** | `bitcoinjs-lib` — Address & transaction |
| **ECC** | `tiny-secp256k1` — WASM-optimized Elliptic Curve |
| **Key Derivation** | `pbkdf2` |

---

## 🚀 Installation

### Requirements
- Node.js 18+
- Yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/visiongaiatechnology/visionbit
cd visionbit

# Install dependencies
yarn install

# Start development server
yarn dev
```

The app is now available at `http://localhost:5173`

---

## 🔒 Air-Gap Deployment Guide

For generating wallets with significant value, **always use an air-gapped machine.**

**Step 1 — Build on your online PC:**
```bash
yarn build
```
This produces a `dist/` folder with the complete, self-contained application.

**Step 2 — Transfer to USB:**
Copy the entire `dist/` folder to a clean USB stick.

**Step 3 — Air-Gap environment:**
- Disconnect the target machine from all networks (WiFi off, cable unplugged)
- Insert the USB stick
- Open the files locally

> **Note:** Some browsers block local ES modules. If needed, run a local static server on the offline machine:
> ```bash
> python3 -m http.server
> ```

**Step 4 — Generate & secure:**
Follow the on-screen instructions. Write your 24 words on paper (or stamp them into metal). Reboot the machine afterward to clear RAM.

---

## ⚠️ Disclaimer

**USE AT YOUR OWN RISK.**

This software is provided "as is" without warranty of any kind. Although the code is written to modern security standards using established cryptographic libraries, the developers assume no liability for lost coins, implementation errors, or hardware failures.

**Responsible handling of private keys is solely the user's responsibility.**

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

Licensed under **MIT** — maximum freedom to use, copy, modify and distribute.

---

## ☕ Support the Project

VisionBit is free and open source. If it helps secure your Bitcoin:

[![Donate via PayPal](https://img.shields.io/badge/Donate-PayPal-00457C?style=for-the-badge&logo=paypal)](https://www.paypal.com/paypalme/dergoldenelotus)

---

## 🏢 Built by VisionGaia Technology

[![VGT](https://img.shields.io/badge/VGT-VisionGaia_Technology-red?style=for-the-badge)](https://visiongaiatechnology.de)

VisionGaia Technology builds enterprise-grade security and AI tooling — engineered to the DIAMANT VGT SUPREME standard.

> *"In a world where exchanges collapse and custodians fail, sovereignty begins with your own keys."*

---

*Version 2.4.0 — VisionBit Secure Wallet // Air-Gap Architecture*
