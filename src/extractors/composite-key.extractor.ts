import type { ApiKeyExtractor, IncomingAuthRequest } from "../types";

export class CompositeKeyExtractor implements ApiKeyExtractor {
  constructor(private readonly extractors: readonly ApiKeyExtractor[]) {}

  extract(request: IncomingAuthRequest): string | undefined {
    for (const extractor of this.extractors) {
      const key = extractor.extract(request);

      if (key !== undefined) {
        return key;
      }
    }
    return undefined;
  }
}
