import {
  DEFAULT_ALLOW_QUERY,
  DEFAULT_ENV_VAR,
  DEFAULT_HEADER_NAME,
  LEGACY_HEADER_NAME,
} from "../constants/auth.constants";
import { TimingSafeKeyComparator } from "../comparators/timing-safe-key.comparator";
import { AuthorizationBearerExtractor } from "../extractors/authorization-bearer.extractor";
import { CompositeKeyExtractor } from "../extractors/composite-key.extractor";
import { HeaderKeyExtractor } from "../extractors/header-key.extractor";
import { LegacyPublicKeyExtractor } from "../extractors/legacy-public-key.extractor";
import { QueryKeyExtractor } from "../extractors/query-key.extractor";
import { ApiKeyAuthService } from "../services/api-key-auth.service";
import { TimingSafeApiKeyValidator } from "../validators/api-key.validator";
import type {
  ApiKeyExtractor,
  AuthService,
  NextAuthMiddlewareOptions,
} from "../types";

export interface AuthServiceConfig {
  readonly headerName: string;
  readonly allowQuery: boolean;
}

export function resolveAuthConfig(
  options?: NextAuthMiddlewareOptions,
): AuthServiceConfig {
  return {
    headerName: options?.headerName ?? DEFAULT_HEADER_NAME,
    allowQuery: options?.allowQuery ?? DEFAULT_ALLOW_QUERY,
  };
}

export function resolveExpectedKeys(
  options?: NextAuthMiddlewareOptions,
): readonly string[] {
  const raw =
    options?.apiKey ?? options?.processEnv ?? process.env[DEFAULT_ENV_VAR];
  if (Array.isArray(raw)) {
    return raw.filter(
      (key): key is string => typeof key === "string" && key.length > 0,
    );
  }

  return typeof raw === "string" && raw.length > 0 ? [raw] : [];
}

export function createKeyExtractor(config: AuthServiceConfig): ApiKeyExtractor {
  const extractors: ApiKeyExtractor[] = [
    new HeaderKeyExtractor(config.headerName),
    new AuthorizationBearerExtractor(),
  ];

  if (config.allowQuery) {
    extractors.push(new QueryKeyExtractor(config.headerName));
  }

  if (config.headerName.toLowerCase() !== LEGACY_HEADER_NAME) {
    extractors.push(new LegacyPublicKeyExtractor(config.allowQuery));
  }

  return new CompositeKeyExtractor(extractors);
}

export function createAuthService(
  options?: NextAuthMiddlewareOptions,
): AuthService {
  const config = resolveAuthConfig(options);

  return new ApiKeyAuthService(
    createKeyExtractor(config),
    new TimingSafeApiKeyValidator(new TimingSafeKeyComparator()),
  );
}
