import { LEGACY_HEADER_NAME } from "../constants/auth.constants";
import type { ApiKeyExtractor, IncomingAuthRequest } from "../types";
import { takeFirst } from "../shared/take-first";
import { stripBearerPrefix } from "../shared/strip-bearer-prefix";

export class LegacyPublicKeyExtractor implements ApiKeyExtractor {
  constructor(private readonly allowQuery: boolean) {}

  extract(request: IncomingAuthRequest): string | undefined {
    const fromHeader = takeFirst(request.headers[LEGACY_HEADER_NAME]);

    if (fromHeader !== undefined) {
      return stripBearerPrefix(fromHeader);
    }

    if (!this.allowQuery) {
      return undefined;
    }

    return takeFirst(request.query[LEGACY_HEADER_NAME]);
  }
}
