# VisionBit Secure Wallet
VisionBit Secure Wallet

VisionBit ist ein hochsicherer, clientseitiger Generator für Bitcoin Cold Wallets. Entwickelt für die Nutzung in vollständig isolierten Umgebungen (Air-Gapped), implementiert VisionBit moderne kryptografische Standards (BIP-39, BIP-84), um private Schlüssel sicher offline zu generieren.

Das Projekt ist vollständig Open Source, transparent und darauf ausgelegt, ohne externe Serververbindungen zu funktionieren.

🛡️ Sicherheits-Architektur

Sicherheit steht bei VisionBit an erster Stelle. Das Design folgt dem Prinzip "Don't Trust, Verify".

Client-Side Execution Only: Der gesamte Code läuft lokal im Browser. Es werden keinerlei Daten (Keys, Mnemonic, Adressen) an Server gesendet.

True Entropy Generation: Wir verlassen uns nicht allein auf den Zufallsgenerator des Browsers (window.crypto). VisionBit sammelt zusätzlich physikalische Entropie durch Mausbewegungen des Nutzers und mischt diese mittels XOR-Operationen in den Entropie-Pool.

Offline-First: Das Build-System ist darauf ausgelegt, eine statische HTML/JS-Sammlung zu erzeugen, die per USB-Stick auf einen Offline-Rechner übertragen werden kann.

No External Dependencies at Runtime: Im Produktions-Build (dist Ordner) werden keine Skripte von CDNs nachgeladen. Alles ist gebündelt.

🚀 Features

BIP-39 Standard: Erstellung von 24-Wörter Mnemonics (256-Bit Sicherheit).

BIP-84 (Native SegWit): Generierung moderner bc1q... Adressen für geringere Transaktionsgebühren.

BIP-39 Passphrase: Unterstützung für optionale Passphrasen (Salt) für zusätzliche Sicherheit ("Plausible Deniability").

Hierarchisch Deterministisch (HD): Ableitung von Schlüsseln und Adressen nach Standard-Pfaden (m/84'/0'/0'/0/0).

Paper Wallet Support: Druckoptimierte Ansicht zum physischen Sichern der Schlüssel.

Zero-Knowledge: Die App hat kein "Gedächtnis". Ein Reload (oder Schließen des Browsers) löscht alle sensiblen Daten aus dem RAM.

🛠️ Technologie-Stack

Der Code ist modern, modular und typensicher aufgebaut, um Audits zu erleichtern.

Core Framework: React 18, TypeScript

Build Tool: Vite (High-Performance Bundler)

Styling: Tailwind CSS

Kryptografie:

bip39: Mnemonic Generierung

bitcoinjs-lib: Adress- & Transaktionslogik

tiny-secp256k1: Elliptic Curve Cryptography (WASM-optimiert)

pbkdf2: Schlüsselableitung

📦 Installation & Entwicklung

Voraussetzungen

Node.js (Version 18+ empfohlen)

Yarn Paketmanager

Setup

Repository klonen:

git clone [https://github.com/visiongaiatechnology/visionbit](https://github.com/visiongaiatechnology/visionbit.git)
cd visionbit


Abhängigkeiten installieren:

yarn install


Entwicklungsserver starten:

yarn dev


Die App ist nun unter http://localhost:5173 erreichbar.

🔒 Anleitung für den sicheren Offline-Einsatz (Cold Storage)

Für die Generierung echter Wallets mit signifikanten Werten wird dringend empfohlen, dies auf einem Computer zu tun, der physisch vom Internet getrennt ist.

Build erstellen:
Erstelle auf deinem Online-PC den Produktions-Build:

yarn build


Dies erzeugt einen Ordner dist, der die komplette, kompilierte Anwendung enthält.

Transfer:
Kopiere den gesamten Inhalt des Ordners dist auf einen sauberen USB-Stick.

Air-Gap (Offline) Umgebung:

Stecke den USB-Stick in einen Computer, der keine Netzwerkverbindung hat (WLAN aus, Kabel gezogen).

Öffne die Dateien vom Stick.

Hinweis: Manche Browser blockieren lokale ES-Module. In diesem Fall kann ein lokaler statischer Server (z.B. Python: python3 -m http.server) auf dem Offline-Gerät notwendig sein, oder die Nutzung eines Browsers, der lokale Dateizugriffe erlaubt.

Generierung:
Folge den Anweisungen auf dem Bildschirm, notiere die 24 Wörter auf Papier (oder stanze sie in Metall) und vernichte danach idealerweise den temporären RAM-Inhalt durch Neustart des Rechners.

📄 Lizenz

Dieses Projekt ist unter der MIT License lizenziert.
Das bedeutet maximale Freiheit: Du darfst den Code verwenden, kopieren, verändern und verbreiten.

Siehe LICENSE für Details.

⚠️ Disclaimer / Haftungsausschluss

NUTZUNG AUF EIGENE GEFAHR.

Diese Software wird "so wie sie ist" ohne jegliche Garantie bereitgestellt. Obwohl der Code nach besten Sicherheitsstandards und unter Verwendung etablierter kryptografischer Bibliotheken geschrieben wurde, übernehmen die Entwickler keine Haftung für verlorene Coins, Fehler in der Implementierung oder Hardware-Probleme.

Verantwortungsvoller Umgang mit privaten Schlüsseln liegt allein beim Nutzer.
