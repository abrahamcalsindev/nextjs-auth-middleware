import { AUTHORIZATION_HEADER } from '../constants/auth.constants';
import type { ApiKeyExtractor, IncomingAuthRequest } from '../types';
import { takeFirst } from '../shared/take-first';
import { stripBearerPrefix } from '../shared/strip-bearer-prefix';

export class AuthorizationBearerExtractor implements ApiKeyExtractor {
  extract(request: IncomingAuthRequest): string | undefined {
    const value = takeFirst(request.headers[AUTHORIZATION_HEADER]);
    if (value === undefined) {
      return undefined;
    }
    const stripped = stripBearerPrefix(value);
    return stripped.length > 0 && stripped !== value ? stripped : undefined;
  }
}
