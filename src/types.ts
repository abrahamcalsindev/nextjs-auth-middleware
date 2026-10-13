export interface IncomingAuthRequest {
  readonly headers: Readonly<Record<string, string | string[] | undefined>>;
  readonly query: Readonly<Record<string, string | string[] | undefined>>;
}

export type AuthFailureReason = 'missing' | 'invalid';

export interface AuthResult {
  readonly authorized: boolean;
  readonly reason?: AuthFailureReason | undefined;
  readonly providedKey?: string | undefined;
}

export interface ApiKeyExtractor {
  extract(request: IncomingAuthRequest): string | undefined;
}

export interface KeyComparator {
  equals(candidate: string, expected: string): boolean;
}

export interface ApiKeyValidator {
  isValid(provided: string, expected: readonly string[]): boolean;
}

export interface AuthService {
  authenticate(request: IncomingAuthRequest, expected: readonly string[]): AuthResult;
}

export interface NextAuthMiddlewareOptions {
  readonly processEnv?: string | undefined;
  readonly apiKey?: string | readonly string[] | undefined;
  readonly headerName?: string | undefined;
  readonly allowQuery?: boolean | undefined;
}

export type authMiddlewareOptions = NextAuthMiddlewareOptions;
