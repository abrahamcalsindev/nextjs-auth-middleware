import type {
  ApiKeyExtractor,
  ApiKeyValidator,
  AuthResult,
  AuthService,
  IncomingAuthRequest,
} from "../types";

export class ApiKeyAuthService implements AuthService {
  constructor(
    private readonly extractor: ApiKeyExtractor,
    private readonly validator: ApiKeyValidator,
  ) {}

  authenticate(
    request: IncomingAuthRequest,
    expected: readonly string[],
  ): AuthResult {
    const providedKey = this.extractor.extract(request);

    if (providedKey === undefined) {
      return { authorized: false, reason: "missing" };
    }

    if (this.validator.isValid(providedKey, expected)) {
      return { authorized: true, providedKey };
    }

    return { authorized: false, reason: "invalid", providedKey };
  }
}
