import type { KeyComparator } from '../types';

export class TimingSafeKeyComparator implements KeyComparator {
  equals(candidate: string, expected: string): boolean {
    if (candidate.length !== expected.length) {
      return false;
    }
    let diff = 0;
    for (let i = 0; i < candidate.length; i++) {
      diff |= candidate.charCodeAt(i) ^ expected.charCodeAt(i);
    }
    return diff === 0;
  }
}
