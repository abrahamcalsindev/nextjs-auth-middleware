import type { ApiKeyValidator, KeyComparator } from "../types";

export class TimingSafeApiKeyValidator implements ApiKeyValidator {
  constructor(private readonly comparator: KeyComparator) {}

  isValid(provided: string, expected: readonly string[]): boolean {
    if (provided.length === 0) {
      return false;
    }

    return expected.some(
      (secret) => secret.length > 0 && this.comparator.equals(provided, secret),
    );
  }
}
