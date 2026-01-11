import { useState, useEffect, useCallback } from 'react';
import { Shield, WifiOff, Cpu, Zap, Database, Lock, RefreshCw } from 'lucide-react';
import { EntropyCollector } from './components/EntropyCollector';
import { WalletDisplay } from './components/WalletDisplay';
import { generateWalletFromEntropy, deriveWalletFromMnemonic, WalletResult } from './utils/cryptoCore';
import { hasSavedVault, loadVaultFromStorage, decryptData, clearVaultStorage } from './utils/secureStorage';

type Step = 'init' | 'login' | 'entropy' | 'generating' | 'wallet';

function App() {
  const [step, setStep] = useState<Step>('init');
  const [passphrase, setPassphrase] = useState('');
  const [walletData, setWalletData] = useState<WalletResult | null>(null);
  
  // Login State
  const [vaultPassword, setVaultPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  // System Start Check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasSavedVault()) {
        setStep('login');
      } else {
        setStep('entropy');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleEntropyComplete = useCallback(async (pool: number[]) => {
    setStep('generating');
    setTimeout(async () => {
      try {
        const wallet = await generateWalletFromEntropy(pool, passphrase);
        setWalletData(wallet);
        setStep('wallet');
      } catch (e) {
        console.error(e);
        alert("Fehler bei der Wallet-Generierung");
        setStep('entropy');
      }
    }, 500);
  }, [passphrase]);

  const handleRegenerateAddress = async () => {
    if (!walletData?.mnemonic) return;
    setStep('generating');
    setTimeout(async () => {
      const newWallet = await deriveWalletFromMnemonic(walletData.mnemonic, passphrase);
      setWalletData(newWallet);
      setStep('wallet');
    }, 500);
  };

  const handleReset = () => {
    setWalletData(null);
    setPassphrase('');
    clearVaultStorage(); // Auch Storage löschen wenn "Reset" gewählt wird
    setStep('entropy');
  };

  const handleVaultUnlock = async () => {
    setLoginError('');
    setIsUnlocking(true);
    
    // Kurze Verzögerung für UI Feedback und um Brute-Force im UI zu bremsen
    setTimeout(async () => {
      try {
        const vault = loadVaultFromStorage();
        if (!vault) throw new Error("Kein Tresor gefunden");

        // Decrypt Mnemonic
        const mnemonic = await decryptData(vault, vaultPassword);
        
        // Regenerate Wallet Data from Mnemonic
        const wallet = await deriveWalletFromMnemonic(mnemonic, ''); 
        
        setWalletData(wallet);
        setVaultPassword('');
        setStep('wallet');
      } catch (e) {
        setLoginError("Passwort falsch oder Daten korrupt.");
        console.error(e);
      } finally {
        setIsUnlocking(false);
      }
    }, 500);
  };

  const handleDeleteVault = () => {
    if (confirm("Wirklich den gespeicherten Tresor löschen? Dies kann nicht rückgängig gemacht werden.")) {
      clearVaultStorage();
      setStep('entropy');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-cyan-50 font-mono relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* Background Grid */}
      <div className="fixed inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Header Status Bar */}
      <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center text-xs border-b border-cyan-900/30 z-50 bg-slate-950/90 backdrop-blur-sm shadow-lg">
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="flex items-center gap-2 text-emerald-400 font-bold tracking-wider">
            <Shield className="w-3 h-3" /> CORE_CRYPTO_ACTIVE
          </span>
          <span className="hidden sm:flex items-center gap-2 text-red-400 animate-pulse">
            <WifiOff className="w-3 h-3" /> OFFLINE_MODE
          </span>
        </div>
        
        <div className="flex items-center gap-4">
           {/* SECURITY BADGE */}
           <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-950/50 border border-cyan-500/30 rounded text-cyan-400 font-bold tracking-wider shadow-[0_0_10px_rgba(6,182,212,0.1)]">
              <Lock className="w-3 h-3" /> AES-256-GCM
           </div>
           
           <div className="text-right hidden sm:block text-cyan-500/60">
             <div className="uppercase tracking-widest text-[10px]">VISIONBIT // SECURE_VAULT</div>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 pt-20">
        
        {step === 'init' && (
          <div className="flex flex-col items-center gap-6 animate-pulse">
            <Cpu className="w-24 h-24 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
            <div className="text-2xl font-bold tracking-[0.3em] text-cyan-200">SYSTEM INITIALISIERUNG</div>
            <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-cyan-500 animate-scanline w-full"></div>
            </div>
            <div className="text-xs text-cyan-800">Checking Local Storage Integrity...</div>
          </div>
        )}

        {/* LOGIN SCREEN */}
        {step === 'login' && (
          <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col gap-6 animate-fade-in">
             <div className="flex justify-center mb-4">
                <div className="p-4 bg-slate-800 rounded-full border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  <Database className="w-12 h-12 text-cyan-400" />
                </div>
             </div>
             
             <div className="text-center">
               <h2 className="text-2xl font-bold text-cyan-100">VERSCHLÜSSELTES WALLET</h2>
               <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded bg-emerald-900/30 border border-emerald-500/30 text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                  <Lock size={10} /> AES-256-GCM Protected
               </div>
               <p className="text-cyan-500/70 text-sm mt-3">Ein lokaler Tresor wurde gefunden. Bitte entschlüsseln.</p>
             </div>

             <div className="space-y-4">
               <div>
                 <input 
                    type="password"
                    value={vaultPassword}
                    onChange={(e) => setVaultPassword(e.target.value)} 
                    placeholder="Tresor Passwort..."
                    className="w-full bg-slate-950 border border-cyan-900/50 p-4 rounded text-white focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] outline-none transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleVaultUnlock()}
                 />
                 {loginError && <div className="text-red-400 text-xs mt-2 text-center">{loginError}</div>}
               </div>

               <button 
                 onClick={handleVaultUnlock}
                 disabled={isUnlocking || !vaultPassword}
                 className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2"
               >
                 {isUnlocking ? <RefreshCw className="animate-spin" /> : <Shield size={18} />}
                 {isUnlocking ? 'Entschlüssele...' : 'Tresor Öffnen'}
               </button>

               <div className="pt-4 border-t border-cyan-900/30 text-center">
                 <button onClick={handleDeleteVault} className="text-xs text-slate-500 hover:text-red-400 transition-colors">
                   Tresor löschen & Neues Wallet erstellen
                 </button>
               </div>
             </div>
          </div>
        )}

        {step === 'entropy' && (
          <EntropyCollector 
            onProgress={() => {}} 
            onComplete={handleEntropyComplete} 
          />
        )}

        {step === 'generating' && (
           <div className="text-center">
             <div className="relative mb-8 mx-auto w-16 h-16">
               <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-t-cyan-400 rounded-full animate-spin"></div>
               <Zap className="absolute inset-0 m-auto w-6 h-6 text-yellow-400" />
             </div>
             <h2 className="text-2xl font-bold text-cyan-100 mb-2">GENERIERUNG LÄUFT</h2>
             <div className="font-mono text-cyan-600 text-xs">PBKDF2 HASHING IN PROGRESS...</div>
           </div>
        )}

        {step === 'wallet' && walletData && (
          <WalletDisplay 
            wallet={walletData}
            passphrase={passphrase}
            setPassphrase={setPassphrase}
            onRegenerateAddress={handleRegenerateAddress}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}

export default App;