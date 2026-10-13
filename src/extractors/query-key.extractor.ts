import type { ApiKeyExtractor, IncomingAuthRequest } from '../types';
import { takeFirst } from '../shared/take-first';

export class QueryKeyExtractor implements ApiKeyExtractor {
  constructor(private readonly headerName: string) {}

  extract(request: IncomingAuthRequest): string | undefined {
    return takeFirst(request.query[this.headerName]);
  }
}
