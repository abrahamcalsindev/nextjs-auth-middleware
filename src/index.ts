import { authMiddleware } from './middleware';

export { verifyApiKey, authMiddleware } from './middleware';
export { createAuthService, createKeyExtractor, resolveAuthConfig, resolveExpectedKeys } from './factories/auth-service.factory';
export { ApiKeyAuthService } from './services/api-key-auth.service';
export { TimingSafeApiKeyValidator } from './validators/api-key.validator';
export { TimingSafeKeyComparator } from './comparators/timing-safe-key.comparator';
export { AuthorizationBearerExtractor } from './extractors/authorization-bearer.extractor';
export { CompositeKeyExtractor } from './extractors/composite-key.extractor';
export { HeaderKeyExtractor } from './extractors/header-key.extractor';
export { LegacyPublicKeyExtractor } from './extractors/legacy-public-key.extractor';
export { QueryKeyExtractor } from './extractors/query-key.extractor';
export type {
  ApiKeyExtractor,
  ApiKeyValidator,
  AuthResult,
  AuthService,
  IncomingAuthRequest,
  KeyComparator,
  NextAuthMiddlewareOptions,
  authMiddlewareOptions,
} from './types';

const NextAuthMiddleware = authMiddleware;

export { NextAuthMiddleware };
export default NextAuthMiddleware;
