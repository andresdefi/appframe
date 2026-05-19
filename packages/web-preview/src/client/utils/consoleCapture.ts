/**
 * Capture recent console.log / warn / error messages in a ring buffer
 * so the export diagnostic carries the trail of warnings that often
 * tell us *why* a failure happened, not just *where*. Patches the
 * native console methods but still forwards calls to the originals
 * so devtools and stdout (if any) keep working.
 *
 * Lives entirely in browser memory; the user owns the contents until
 * they paste the diagnostic JSON somewhere themselves.
 */

interface LogEntry {
  t: string; // ISO timestamp
  level: 'log' | 'info' | 'warn' | 'error';
  message: string;
}

const CAPACITY = 100;
const buffer: LogEntry[] = [];
let installed = false;

function formatArg(arg: unknown): string {
  if (arg === null) return 'null';
  if (arg === undefined) return 'undefined';
  if (typeof arg === 'string') return arg;
  if (arg instanceof Error) {
    return `${arg.name}: ${arg.message}${arg.stack ? `\n${arg.stack}` : ''}`;
  }
  try {
    return JSON.stringify(arg);
  } catch {
    return String(arg);
  }
}

function record(level: LogEntry['level'], args: unknown[]): void {
  const message = args.map(formatArg).join(' ');
  buffer.push({ t: new Date().toISOString(), level, message });
  if (buffer.length > CAPACITY) buffer.shift();
}

export function setupConsoleCapture(): void {
  if (installed) return;
  installed = true;
  const original = {
    log: console.log.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
  };
  console.log = (...args: unknown[]) => {
    record('log', args);
    original.log(...args);
  };
  console.info = (...args: unknown[]) => {
    record('info', args);
    original.info(...args);
  };
  console.warn = (...args: unknown[]) => {
    record('warn', args);
    original.warn(...args);
  };
  console.error = (...args: unknown[]) => {
    record('error', args);
    original.error(...args);
  };
}

export function getRecentLogs(): LogEntry[] {
  return buffer.slice();
}

export function clearRecentLogs(): void {
  buffer.length = 0;
}
