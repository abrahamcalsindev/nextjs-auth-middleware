import type { NextApiRequest, NextApiResponse } from 'next';
import {
  HTTP_BAD_REQUEST,
  HTTP_UNAUTHORIZED,
  INVALID_KEY_MESSAGE,
  MISSING_KEY_MESSAGE,
} from '../constants/auth.constants';
import type { AuthResult, IncomingAuthRequest } from '../types';

export function toIncomingRequest(req: NextApiRequest): IncomingAuthRequest {
  return {
    headers: req.headers as IncomingAuthRequest['headers'],
    query: req.query as IncomingAuthRequest['query'],
  };
}

export function sendUnauthorized(res: NextApiResponse, result: AuthResult): void {
  if (result.reason === 'missing') {
    res.status(HTTP_BAD_REQUEST).json({ error: { message: MISSING_KEY_MESSAGE } });
    return;
  }

  res.status(HTTP_UNAUTHORIZED).json({ error: { message: INVALID_KEY_MESSAGE } });
}
