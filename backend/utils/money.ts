export function decimalToCents(value: string): number {
  const match = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(value.trim());

  if (!match) {
    throw new Error(`Invalid monetary value: ${value}`);
  }

  const sign = match[1] === '-' ? -1 : 1;
  const whole = Number(match[2]);
  const fraction = Number((match[3] ?? '').padEnd(2, '0'));
  const cents = whole * 100 + fraction;

  if (!Number.isSafeInteger(cents)) {
    throw new Error(`Monetary value exceeds the supported range: ${value}`);
  }

  return sign * cents;
}

export function centsToAmount(cents: number): string {
  if (!Number.isSafeInteger(cents)) {
    throw new Error('Monetary amount must be a safe integer');
  }

  const sign = cents < 0 ? '-' : '';
  const absolute = Math.abs(cents);
  const whole = Math.floor(absolute / 100);
  const fraction = String(absolute % 100).padStart(2, '0');

  return `${sign}${whole}.${fraction}`;
}
