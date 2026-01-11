/**
 * BLOCKCHAIN CONNECTIVITY MODULE
 * ------------------------------
 * Kapselt alle externen API-Aufrufe.
 * Nutzt mempool.space API (Open Source Standard) für Balance-Checks.
 * * PRIVACY NOTE:
 * Diese Funktionen erfordern eine Internetverbindung.
 * Es wird nur die PUBLIC ADDRESS übertragen.
 */

interface ChainStats {
  funded_txo_count: number;
  funded_txo_sum: number;
  spent_txo_count: number;
  spent_txo_sum: number;
  tx_count: number;
}

interface AddressInfo {
  address: string;
  chain_stats: ChainStats;
  mempool_stats: ChainStats;
}

export interface BalanceResult {
  sats: number;
  btc: string;
  totalTx: number;
  fiatEstimate?: number; // Optional für später
}

export const fetchAddressBalance = async (address: string): Promise<BalanceResult> => {
  try {
    // Nutzung der mempool.space API (Zuverlässigster Bitcoin Explorer)
    const response = await fetch(`https://mempool.space/api/address/${address}`);
    
    if (!response.ok) {
      throw new Error(`API Fehler: ${response.status}`);
    }

    const data: AddressInfo = await response.json();

    // Berechnung: Empfangen - Ausgegeben = Aktueller Stand
    // Wir addieren Confirmed (chain) und Unconfirmed (mempool) für Echtzeit-Feeling
    const confirmedBalance = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
    const mempoolBalance = data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum;
    
    const totalSats = confirmedBalance + mempoolBalance;
    const totalTx = data.chain_stats.tx_count + data.mempool_stats.tx_count;

    return {
      sats: totalSats,
      btc: (totalSats / 100_000_000).toFixed(8), // 8 Dezimalstellen Standard
      totalTx: totalTx
    };

  } catch (error) {
    console.error("Blockchain Abfrage fehlgeschlagen:", error);
    throw error;
  }
};