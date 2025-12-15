type LogLevel = "debug" | "info" | "warn" | "error";

function log(level: LogLevel, message: string, meta?: unknown): void {
  const ts = new Date().toISOString();
  if (meta !== undefined) {
    // eslint-disable-next-line no-console
    console.log(`[${ts}] [${level.toUpperCase()}] ${message}`, meta);
  } else {
    // eslint-disable-next-line no-console
    console.log(`[${ts}] [${level.toUpperCase()}] ${message}`);
  }
}

export const logger = {
  debug: (msg: string, meta?: unknown) => log("debug", msg, meta),
  info: (msg: string, meta?: unknown) => log("info", msg, meta),
  warn: (msg: string, meta?: unknown) => log("warn", msg, meta),
  error: (msg: string, meta?: unknown) => log("error", msg, meta),
};
