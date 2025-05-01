import { SolanaMonitor } from './monitor';

let monitor: SolanaMonitor | null = null;

export function initializeSolanaMonitoring() {
  if (!monitor) {
    monitor = new SolanaMonitor();
  }
  return monitor;
}

export function startMonitoring() {
  if (!monitor) {
    monitor = initializeSolanaMonitoring();
  }
  monitor.startMonitoring();
}

export function stopMonitoring() {
  if (monitor) {
    monitor.stopMonitoring();
  }
}

// Initialize monitoring when the module is imported
if (process.env.NODE_ENV === 'production') {
  startMonitoring();
} 