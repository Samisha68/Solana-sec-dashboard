import { Connection, LAMPORTS_PER_SOL, ParsedTransactionWithMeta } from '@solana/web3.js';

// Known exploit patterns
const SUSPICIOUS_PATTERNS = {
  LARGE_TRANSFER: 1000 * LAMPORTS_PER_SOL, // 1000 SOL
  RAPID_TRANSFERS: 5, // Number of transfers in a short time
  KNOWN_EXPLOIT_ADDRESSES: new Set<string>([
    // Add known exploit addresses here
  ]),
};

type SuspiciousActivity = {
  type: string;
  amount?: number;
  address?: string;
  signature: string;
  timestamp: string;
  count?: number;
};

export class SolanaMonitor {
  private connection: Connection;
  private isMonitoring: boolean = false;
  private lastProcessedSignature: string | null = null;

  constructor(endpoint: string = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com') {
    this.connection = new Connection(endpoint, 'confirmed');
  }

  async startMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    try {
      // Get the latest signature to start monitoring from
      const latestSignature = await this.connection.getLatestBlockhash();
      this.lastProcessedSignature = latestSignature.blockhash;

      // Start monitoring new transactions
      this.connection.onLogs(
        'all',
        async (logs) => {
          if (!logs.err) {
            await this.processTransaction(logs.signature);
          }
        },
        'confirmed'
      );

      console.log('Started monitoring Solana transactions');
    } catch (error) {
      console.error('Error starting monitoring:', error);
      this.isMonitoring = false;
    }
  }

  private async processTransaction(signature: string) {
    try {
      const tx = await this.connection.getParsedTransaction(signature, {
        maxSupportedTransactionVersion: 0,
      });

      if (!tx) return;

      const suspiciousActivity = await this.detectSuspiciousActivity(tx);
      if (suspiciousActivity) {
        await this.reportSuspiciousActivity(suspiciousActivity);
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
    }
  }

  private async detectSuspiciousActivity(tx: ParsedTransactionWithMeta) {
    const suspiciousActivities = [];

    // Check for large transfers
    if (tx.meta?.postBalances && tx.meta?.preBalances) {
      for (let i = 0; i < tx.meta.postBalances.length; i++) {
        const balanceChange = Math.abs(tx.meta.postBalances[i] - tx.meta.preBalances[i]);
        if (balanceChange > SUSPICIOUS_PATTERNS.LARGE_TRANSFER) {
          suspiciousActivities.push({
            type: 'LARGE_TRANSFER',
            amount: balanceChange / LAMPORTS_PER_SOL,
            signature: tx.transaction.signatures[0],
            timestamp: new Date().toISOString(),
          });
        }
      }
    }

    // Check for known exploit addresses
    const accounts = tx.transaction.message.accountKeys;
    for (const account of accounts) {
      if (SUSPICIOUS_PATTERNS.KNOWN_EXPLOIT_ADDRESSES.has(account.toString())) {
        suspiciousActivities.push({
          type: 'KNOWN_EXPLOIT_ADDRESS',
          address: account.toString(),
          signature: tx.transaction.signatures[0],
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Check for rapid transfers
    // Ensure there's at least one account before accessing it
    if (accounts.length > 0) {
      const recentTxs = await this.connection.getSignaturesForAddress(
        accounts[0].pubkey, // Use the pubkey property which is of type PublicKey
        { limit: SUSPICIOUS_PATTERNS.RAPID_TRANSFERS }
      );

      if (recentTxs.length >= SUSPICIOUS_PATTERNS.RAPID_TRANSFERS) {
      suspiciousActivities.push({
        type: 'RAPID_TRANSFERS',
        count: recentTxs.length,
        signature: tx.transaction.signatures[0],
        timestamp: new Date().toISOString(),
      });
    }

    return suspiciousActivities.length > 0 ? suspiciousActivities : null;
  }
  }

  private async reportSuspiciousActivity(activities: SuspiciousActivity[]) {
    try {
      // Send to our API endpoint
      const response = await fetch('/api/security/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activities,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to report suspicious activity');
      }

      console.log('Reported suspicious activity:', activities);
    } catch (error) {
      console.error('Error reporting suspicious activity:', error);
    }
  }

  stopMonitoring() {
    if (!this.isMonitoring) return;
    // this.connection.removeAllListeners();
    this.isMonitoring = false;
    console.log('Stopped monitoring Solana transactions');
  }
} 