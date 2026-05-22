// Tiny structured logger. One line of JSON per event so the host can
// pipe to anything that ingests ndjson (jq, Datadog, Loki, etc).
// Falls back to a human-readable string when stdout is a TTY — keeps
// `pnpm preview` readable during local dev without losing structure
// when redirected to a file or a log aggregator.

export type LogLevel = 'info' | 'warn' | 'error';

const IS_TTY = Boolean(process.stdout.isTTY);

export interface LogEvent {
  level: LogLevel;
  msg: string;
  [k: string]: unknown;
}

function emit(event: LogEvent): void {
  const enriched = { ts: new Date().toISOString(), ...event };
  if (IS_TTY) {
    const { ts, level, msg, ...rest } = enriched;
    const colour =
      level === 'error' ? '\x1b[31m' : level === 'warn' ? '\x1b[33m' : '\x1b[36m';
    const reset = '\x1b[0m';
    const extras = Object.keys(rest).length > 0 ? ' ' + JSON.stringify(rest) : '';
    const stream = level === 'error' ? process.stderr : process.stdout;
    stream.write(`${colour}[${ts}] ${level.toUpperCase()}${reset} ${msg}${extras}\n`);
    return;
  }
  const stream = event.level === 'error' ? process.stderr : process.stdout;
  stream.write(JSON.stringify(enriched) + '\n');
}

export const log = {
  info(msg: string, extra: Record<string, unknown> = {}): void {
    emit({ level: 'info', msg, ...extra });
  },
  warn(msg: string, extra: Record<string, unknown> = {}): void {
    emit({ level: 'warn', msg, ...extra });
  },
  error(msg: string, extra: Record<string, unknown> = {}): void {
    emit({ level: 'error', msg, ...extra });
  },
};
