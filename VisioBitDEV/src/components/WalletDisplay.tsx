import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Eye, EyeOff, RefreshCw, Key, CheckCircle, Printer, Copy, AlertTriangle, ShieldCheck, Dna, HardDrive, Globe, Bitcoin, Activity, Wifi, ArrowUpRight, Info } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { WalletResult } from '../utils/cryptoCore';
import { generateStrongPassword, encryptData, decryptData, saveVaultToStorage, EncryptedContainer } from '../utils/secureStorage';
import { fetchAddressBalance, BalanceResult } from '../utils/blockchain';

interface WalletDisplayProps {
  wallet: WalletResult;
  passphrase: string;
  setPassphrase: (p: string) => void;
  onRegenerateAddress: () => void;
  onReset: () => void;
}

export const WalletDisplay: React.FC<WalletDisplayProps> = ({ 
  wallet, passphrase, setPassphrase, onRegenerateAddress, onReset 
}) => {
  // UI States
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showTransferInfo, setShowTransferInfo] = useState(false);

  // Security Vault States
  const [isLocked, setIsLocked] = useState(false);
  const [vaultPassword, setVaultPassword] = useState("");
  const [encryptedMnemonic, setEncryptedMnemonic] = useState<EncryptedContainer | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [visibleMnemonic, setVisibleMnemonic] = useState<string | null>(wallet.mnemonic);

  // Blockchain States
  const [balance, setBalance] = useState<BalanceResult | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  // Initial Sync
  useEffect(() => {
    if (!isLocked) {
      setVisibleMnemonic(wallet.mnemonic);
    }
    // Reset Balance on wallet change
    setBalance(null);
    setBalanceError(null);
  }, [wallet.mnemonic, isLocked]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleCheckBalance = async () => {
    setIsLoadingBalance(true);
    setBalanceError(null);
    try {
      const result = await fetchAddressBalance(wallet.address);
      setBalance(result);
    } catch (e) {
      setBalanceError("Netzwerkfehler");
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // --- Security Functions (Lock/Unlock/Save) ---
  const handleLockWallet = async () => {
    if (!vaultPassword) { alert("Bitte setze zuerst ein Passwort für den Safe."); return; }
    try {
      if (!visibleMnemonic) return;
      const encrypted = await encryptData(visibleMnemonic, vaultPassword);
      setEncryptedMnemonic(encrypted);
      setVisibleMnemonic(null);
      setIsLocked(true);
      setVaultPassword("");
    } catch (e) { alert("Verschlüsselung fehlgeschlagen."); }
  };

  const handleUnlockWallet = async () => {
    if (!encryptedMnemonic || !vaultPassword) return;
    try {
      const decrypted = await decryptData(encryptedMnemonic, vaultPassword);
      setVisibleMnemonic(decrypted);
      setIsLocked(false);
      setEncryptedMnemonic(null);
    } catch (e) { alert("Falsches Passwort! Zugriff verweigert."); }
  };

  const handleSaveToDevice = async () => {
    if (!vaultPassword) { alert("Passwort erforderlich."); return; }
    if (!visibleMnemonic) return;
    try {
      const encrypted = await encryptData(visibleMnemonic, vaultPassword);
      const success = saveVaultToStorage(encrypted);
      setSaveStatus(success ? 'success' : 'error');
      if (success) setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (e) { setSaveStatus('error'); }
  };

  const generateVaultPassword = () => {
    const pwd = generateStrongPassword(32);
    setVaultPassword(pwd);
  };

  return (
    <>
      {/* === SCREEN UI === */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in pb-20">
        
        {/* Left Column: Controls & Security */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* VAULT CONTROL PANEL */}
          <div className={`p-6 rounded-xl flex flex-col gap-4 border transition-all ${isLocked ? 'bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'bg-slate-900/80 border-cyan-900/20'}`}>
             <div className="flex items-center gap-3 mb-2 pb-2 border-b border-white/5 justify-between">
                <div className="flex items-center gap-3">
                  {isLocked ? <ShieldCheck className="w-6 h-6 text-emerald-400" /> : <Unlock className="w-6 h-6 text-red-400" />}
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">RAM Vault</h3>
                    <div className="text-[10px] uppercase tracking-wider font-mono">
                      {isLocked ? <span className="text-emerald-400">SECURE</span> : <span className="text-red-400">UNSECURED</span>}
                    </div>
                  </div>
                </div>
                <div className="bg-slate-950 px-2 py-1 rounded border border-white/10 text-[9px] font-mono text-slate-400 flex items-center gap-1">
                   <Lock size={8} /> AES-256-GCM
                </div>
             </div>

             {!isLocked ? (
               <>
                 <p className="text-xs text-slate-400">Setze ein Passwort für RAM-Sperre oder Speicherung.</p>
                 <div className="flex gap-2">
                   <input 
                      type="text" 
                      value={vaultPassword}
                      onChange={(e) => setVaultPassword(e.target.value)}
                      placeholder="Starkes Passwort..."
                      className="flex-1 bg-slate-950 border border-slate-700 p-2 rounded text-sm text-white font-mono"
                   />
                   <button onClick={generateVaultPassword} title="Generiere Passwort" className="p-2 bg-slate-800 rounded hover:bg-cyan-900/50 text-cyan-400">
                      <Dna size={18} />
                   </button>
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                   <button onClick={handleLockWallet} disabled={!vaultPassword} className="bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-600/50 text-emerald-200 py-2 px-2 rounded text-[10px] font-bold uppercase flex items-center justify-center gap-1 disabled:opacity-50">
                     <Lock size={12} /> RAM Lock
                   </button>
                   <button onClick={handleSaveToDevice} disabled={!vaultPassword} className="bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-600/50 text-cyan-200 py-2 px-2 rounded text-[10px] font-bold uppercase flex items-center justify-center gap-1 disabled:opacity-50">
                     <HardDrive size={12} /> Speichern
                   </button>
                 </div>
                 {saveStatus === 'success' && <div className="text-[10px] text-emerald-400 text-center flex items-center justify-center gap-1 bg-emerald-900/20 p-1 rounded"><CheckCircle size={10} /> Gespeichert!</div>}
               </>
             ) : (
               <>
                 <input type="password" value={vaultPassword} onChange={(e) => setVaultPassword(e.target.value)} placeholder="Passwort..." className="w-full bg-slate-950 border border-emerald-900/50 p-2 rounded text-sm text-white font-mono focus:border-emerald-500 outline-none" onKeyDown={(e) => e.key === 'Enter' && handleUnlockWallet()} />
                 <button onClick={handleUnlockWallet} className="bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-lg"><Unlock size={14} /> Öffnen</button>
               </>
             )}
          </div>

          {/* BIP-39 Passphrase Panel */}
          {!isLocked && (
            <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-xl flex flex-col gap-4 border-l-4 border-l-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.1)] border border-cyan-900/20">
              <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                <Lock className="w-5 h-5 text-yellow-400" />
                <div><h3 className="text-lg font-bold text-yellow-100">Passphrase (Salt)</h3></div>
              </div>
              <div className="relative group">
                <input type={showPassphrase ? "text" : "password"} value={passphrase} onChange={(e) => setPassphrase(e.target.value)} placeholder="Passphrase..." className="w-full bg-slate-950 border border-cyan-900/50 p-3 rounded text-cyan-100 font-mono text-sm" />
                <button onClick={() => setShowPassphrase(!showPassphrase)} className="absolute right-3 top-3 text-slate-500 hover:text-cyan-400">{showPassphrase ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
              <button onClick={onRegenerateAddress} className="bg-yellow-600/20 hover:bg-yellow-600/40 border border-yellow-600/50 text-yellow-200 py-2 px-4 rounded text-xs font-bold uppercase flex items-center justify-center gap-2"><RefreshCw size={14} /> Neu berechnen</button>
            </div>
          )}
          
          <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-xl border border-cyan-900/20 flex flex-col gap-3">
             <button onClick={() => isLocked ? alert("Bitte erst entsperren!") : window.print()} className={`py-3 px-4 rounded font-bold flex items-center justify-center gap-2 shadow-lg transition-all group ${isLocked ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500 text-white'}`}><Printer className="w-5 h-5 group-hover:scale-110 transition-transform" /> PAPER WALLET</button>
             <button onClick={() => { if(confirm("Sicher? Dies löscht RAM und lokalen Speicher unwiderruflich.")) { onReset(); }}} className="bg-slate-800 hover:bg-red-900/30 text-slate-400 hover:text-red-400 border border-transparent hover:border-red-900/50 py-3 px-4 rounded font-bold flex items-center justify-center gap-2 text-xs"><RefreshCw className="w-4 h-4" /> RESET ALL</button>
          </div>
        </div>

        {/* Right Column: Wallet Data */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* BALANCE & NETWORK STATUS DASHBOARD */}
          <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-xl border border-cyan-900/20 relative overflow-hidden">
             {/* Background Element */}
             <div className="absolute -right-10 -top-10 opacity-5">
                <Bitcoin size={200} />
             </div>

             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
                <div>
                   <h3 className="text-xl font-bold text-cyan-100 flex items-center gap-2 mb-1">
                     <Activity className="text-cyan-400" /> LIVE NETWORK STATUS
                   </h3>
                   <div className="text-xs text-slate-400 flex items-center gap-2">
                     <Globe size={12} /> Connected to Mempool API
                   </div>
                </div>

                <div className="text-right flex flex-col items-end">
                   {balance ? (
                      <div className="animate-fade-in">
                         <div className="text-3xl font-bold text-white font-mono tracking-tight">
                            {balance.btc} <span className="text-orange-500">BTC</span>
                         </div>
                         <div className="text-sm text-slate-400 font-mono">
                            {balance.sats.toLocaleString()} Sats • {balance.totalTx} Transaktionen
                         </div>
                      </div>
                   ) : (
                      <div className="text-3xl font-bold text-slate-700 font-mono tracking-tight">
                         0.00000000 <span className="text-slate-800">BTC</span>
                      </div>
                   )}
                   
                   {balanceError && (
                     <span className="text-red-400 text-xs mt-1 bg-red-900/20 px-2 py-1 rounded border border-red-500/20">{balanceError}</span>
                   )}
                </div>
             </div>

             {/* Action Bar (Ping & Transfer Info) */}
             <div className="mt-6 pt-6 border-t border-cyan-900/30 flex flex-col sm:flex-row justify-between items-center gap-4">
                 <div className="text-[10px] text-slate-500 max-w-xs leading-tight text-center sm:text-left">
                    Verbindet sich mit Block-Explorer. IP-Adresse wird bei Abfrage sichtbar.
                 </div>
                 
                 <div className="flex gap-3">
                   {/* PING BUTTON */}
                   <button 
                     onClick={handleCheckBalance}
                     disabled={isLoadingBalance}
                     className="bg-slate-800 hover:bg-cyan-900/40 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
                   >
                     {isLoadingBalance ? <RefreshCw className="animate-spin w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                     {isLoadingBalance ? 'Verbinde...' : 'Check Balance'}
                   </button>

                   {/* DUMMY/INFO TRANSFER BUTTON */}
                   <button 
                     onClick={() => setShowTransferInfo(!showTransferInfo)}
                     className="bg-slate-900/50 text-slate-500 border border-slate-700 hover:border-orange-500/50 hover:text-orange-400 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
                   >
                     <ArrowUpRight className="w-4 h-4" /> Transfer
                   </button>
                 </div>
             </div>
             
             {/* COLD STORAGE EDUCATIONAL PANEL (Wenn Transfer geklickt wird) */}
             {showTransferInfo && (
               <div className="mt-4 bg-orange-950/20 border border-orange-500/30 p-4 rounded-lg animate-fade-in">
                 <div className="flex items-start gap-3">
                   <Info className="text-orange-500 w-5 h-5 shrink-0 mt-0.5" />
                   <div>
                     <h4 className="text-orange-400 font-bold text-sm mb-1">Cold Storage Sicherheits-Protokoll</h4>
                     <p className="text-orange-200/70 text-xs leading-relaxed mb-2">
                       Aus Sicherheitsgründen ist das direkte Senden (Signieren) in diesem Browser deaktiviert. 
                       Dies schützt deinen Private Key vor Online-Angriffen.
                     </p>
                     <p className="text-orange-200/70 text-xs leading-relaxed">
                       <strong>Um Coins sicher zu senden:</strong><br/>
                       1. Importiere die 24 Wörter (Mnemonic) in eine Hot Wallet (z.B. BlueWallet, Sparrow).<br/>
                       2. Oder nutze die "Sweep" Funktion einer Wallet App, um das gesamte Guthaben abzuziehen.
                     </p>
                   </div>
                 </div>
               </div>
             )}
          </div>

          {/* Address Section */}
          <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-xl border-t-4 border-t-emerald-500/50 border border-cyan-900/20">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
               <div>
                  <h3 className="text-xl font-bold text-emerald-100 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" /> PUBLIC ADDRESS
                  </h3>
                  <div className="text-[10px] text-emerald-600/80 font-mono mt-1">{wallet.path} (Native SegWit)</div>
               </div>
               <div className="bg-white p-2 rounded hidden sm:block">
                  <QRCodeSVG value={wallet.address} size={64} level="M" />
               </div>
             </div>

             <div className="bg-slate-950 p-4 rounded-lg border border-emerald-900/50 font-mono text-sm sm:text-base break-all text-emerald-400 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] flex items-center justify-between gap-4 relative group">
                {wallet.address}
                <button onClick={() => copyToClipboard(wallet.address, 'addr')} className="p-2 hover:bg-emerald-900/30 rounded text-emerald-600 transition-colors absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
                  {copiedField === 'addr' ? <CheckCircle size={20} /> : <Copy size={20} />}
                </button>
             </div>
          </div>

          {/* Seed Section */}
          <div className={`bg-slate-900/80 backdrop-blur-md p-6 rounded-xl border-l-4 relative overflow-hidden transition-all duration-500 ${isLocked ? 'border-l-emerald-500/50 border border-emerald-900/20' : 'border-l-red-500/50 border border-cyan-900/20'}`}>
            <div className="flex justify-between items-center mb-6">
               <h3 className={`text-xl font-bold flex items-center gap-2 ${isLocked ? 'text-emerald-100' : 'text-red-100'}`}>
                {isLocked ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <Key className="w-5 h-5 text-red-400" />}
                PRIVATE KEY
              </h3>
              <div className={`text-xs font-bold border px-3 py-1 rounded ${isLocked ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-red-500 border-red-500/30 bg-red-500/10'}`}>
                {isLocked ? 'ENCRYPTED & SECURED' : 'DO NOT SHARE'}
              </div>
            </div>

            {isLocked ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center animate-fade-in">
                 <div className="p-4 bg-emerald-900/20 rounded-full border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]"><Lock className="w-12 h-12 text-emerald-400" /></div>
                 <div>
                   <h4 className="text-xl font-bold text-emerald-100">Tresor ist verschlossen</h4>
                   <p className="text-emerald-400/60 text-sm max-w-md mt-2">Mnemonic ist mit <strong>AES-256-GCM</strong> verschlüsselt.</p>
                 </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 animate-fade-in">
                  {visibleMnemonic?.split(' ').map((word, i) => (
                    <div key={i} className="bg-slate-950 border border-cyan-900/30 p-2 rounded text-center relative overflow-hidden select-all">
                      <span className="absolute top-1 left-1.5 text-[9px] text-slate-600 font-mono select-none">{i + 1}</span>
                      <span className="text-cyan-50 font-bold tracking-wide text-sm">{word}</span>
                    </div>
                  ))}
                </div>
                {passphrase && (<div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded flex items-center gap-3"><AlertTriangle className="text-yellow-500 w-5 h-5 shrink-0" /><span className="text-xs text-yellow-200/80">WICHTIG: Passphrase <strong>"{passphrase}"</strong> ist Teil des Backups.</span></div>)}
              </>
            )}
          </div>
        </div>
      </div>

      {/* === PAPER WALLET TEMPLATE === */}
      <div className="print-only">
        {!isLocked && visibleMnemonic ? (
          <div className="border-[4px] border-black p-8 h-full relative flex flex-col justify-between">
            <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
              <div><h1 className="text-4xl font-bold uppercase tracking-wider mb-2">Bitcoin Cold Storage</h1><p className="text-sm text-gray-600">Generated offline via VisioBit Secure Engine.</p><p className="text-xs text-gray-500 mt-1">Date: {wallet.created}</p></div>
              <div className="text-right"><div className="text-xl font-bold">SEG WYT / BIP84</div><div className="text-sm">Network: Mainnet</div></div>
            </div>
            <div className="flex gap-8 mb-8">
              <div className="w-32 h-32 shrink-0 border-2 border-black p-1"><QRCodeSVG value={wallet.address} size={120} level="H" /></div>
              <div className="flex-1 flex flex-col justify-center"><div className="text-sm font-bold uppercase mb-1 border-b border-gray-300 w-fit">Public Address (Receive)</div><div className="font-mono text-lg break-all font-bold bg-gray-100 p-2 border border-gray-300">{wallet.address}</div></div>
            </div>
            <hr className="border-black border-dashed my-4" />
            <div className="flex gap-8 mt-4">
               <div className="flex-1">
                 <div className="flex items-center gap-4 mb-4"><div className="bg-black text-white px-4 py-1 font-bold text-sm uppercase">Private Key (Secret)</div>{passphrase && <div className="border border-black px-4 py-1 font-bold text-sm uppercase">Requires Passphrase!</div>}</div>
                 <div className="grid grid-cols-4 gap-4 mb-4">{visibleMnemonic.split(' ').map((word, i) => (<div key={i} className="flex border-b border-gray-400 pb-1"><span className="w-6 text-gray-500 text-xs select-none pt-1">{i + 1}</span><span className="font-bold font-mono">{word}</span></div>))}</div>
                 {passphrase && (<div className="mt-4 border-2 border-black p-3"><span className="block text-xs uppercase font-bold text-gray-600 mb-1">Passphrase (SALT)</span><span className="font-mono text-lg font-bold">{passphrase}</span></div>)}
               </div>
               <div className="w-32 flex flex-col items-center gap-2"><div className="w-32 h-32 border-2 border-black p-1 relative"><QRCodeSVG value={visibleMnemonic} size={120} level="L" /><div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="bg-white px-1 text-[10px] font-bold border border-black">SECRET</div></div></div><div className="text-[10px] text-center font-bold text-red-600 uppercase">Niemals scannen<br/>wenn online!</div></div>
            </div>
            <div className="mt-auto pt-6 border-t-2 border-black text-xs text-gray-600 flex justify-between"><div className="max-w-md"><strong>ANLEITUNG:</strong> Sicher aufbewahren. Wer diese Wörter hat, hat Zugriff auf das Guthaben.</div><div className="text-right font-mono">VisioBit ID: {wallet.xpub.substring(0, 8)}...</div></div>
          </div>
        ) : (<div className="flex items-center justify-center h-full text-4xl font-bold uppercase text-gray-300">WALLET LOCKED - PRINTING DISABLED</div>)}
      </div>
    </>
  );
};