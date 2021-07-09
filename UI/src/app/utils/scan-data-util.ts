import { dbTypeWithLimits } from '@scan-data/scan-data.constants';

export function hasLimits(type: string): string | null {
  const keys = Object.keys(dbTypeWithLimits)
  return keys.includes(type) ? dbTypeWithLimits[type] : null;
}
