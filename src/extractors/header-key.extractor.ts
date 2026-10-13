import type { ApiKeyExtractor, IncomingAuthRequest } from "../types";
import { takeFirst } from "../shared/take-first";
import { stripBearerPrefix } from "../shared/strip-bearer-prefix";

export class HeaderKeyExtractor implements ApiKeyExtractor {
  private readonly normalizedHeader: string;

  constructor(private readonly headerName: string) {
    this.normalizedHeader = headerName.toLowerCase();
  }

  extract(request: IncomingAuthRequest): string | undefined {
    const raw =
      request.headers[this.normalizedHeader] ??
      request.headers[this.headerName];
    const value = takeFirst(raw);

    return value === undefined ? undefined : stripBearerPrefix(value);
  }
}
