import type { NextApiRequest, NextApiResponse } from "next";
import {
  sendUnauthorized,
  toIncomingRequest,
} from "./adapters/next-api.adapter";
import {
  createAuthService,
  resolveExpectedKeys,
} from "./factories/auth-service.factory";
import type {
  AuthResult,
  AuthService,
  IncomingAuthRequest,
  NextAuthMiddlewareOptions,
} from "./types";

export function verifyApiKey(
  request: IncomingAuthRequest,
  options?: NextAuthMiddlewareOptions,
  service?: AuthService,
): AuthResult {
  const authService = service ?? createAuthService(options);
  return authService.authenticate(request, resolveExpectedKeys(options));
}

export async function authMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  options?: NextAuthMiddlewareOptions,
): Promise<void> {
  const result = verifyApiKey(toIncomingRequest(req), options);

  if (result.authorized) {
    return;
  }

  sendUnauthorized(res, result);
  throw result;
}
