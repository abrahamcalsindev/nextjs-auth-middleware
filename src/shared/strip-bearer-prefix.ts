import { BEARER_PREFIX } from '../constants/auth.constants';

export function stripBearerPrefix(value: string): string {
  return value.startsWith(BEARER_PREFIX) ? value.slice(BEARER_PREFIX.length) : value;
}
