import type { NextApiRequest, NextApiResponse } from 'next';
import NextAuthMiddleware, { authMiddleware, verifyApiKey } from '../src/index';
import { AuthorizationBearerExtractor } from '../src/extractors/authorization-bearer.extractor';
import { HeaderKeyExtractor } from '../src/extractors/header-key.extractor';
import { CompositeKeyExtractor } from '../src/extractors/composite-key.extractor';
import { TimingSafeKeyComparator } from '../src/comparators/timing-safe-key.comparator';
import { TimingSafeApiKeyValidator } from '../src/validators/api-key.validator';
import { ApiKeyAuthService } from '../src/services/api-key-auth.service';

function mockRes() {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  return { status, json, statusMock: status, jsonMock: json } as unknown as NextApiResponse & { statusMock: jest.Mock; jsonMock: jest.Mock };
}

function mockReq(headers: Record<string, string | undefined> = {}, query: Record<string, string | undefined> = {}): NextApiRequest {
  return { headers, query } as unknown as NextApiRequest;
}

describe('TimingSafeKeyComparator (SRP: only compares)', () => {
  it('matches identical keys and rejects different ones', () => {
    const c = new TimingSafeKeyComparator();
    expect(c.equals('abc', 'abc')).toBe(true);
    expect(c.equals('abc', 'abd')).toBe(false);
    expect(c.equals('abc', 'abcd')).toBe(false);
  });
});

describe('Extractors (OCP: new sources without modifying existing)', () => {
  it('HeaderKeyExtractor strips Bearer prefix', () => {
    const ex = new HeaderKeyExtractor('x-api-public-key');
    expect(ex.extract({ headers: { 'x-api-public-key': 'Bearer secret' }, query: {} })).toBe('secret');
    expect(ex.extract({ headers: {}, query: {} })).toBeUndefined();
  });

  it('AuthorizationBearerExtractor only accepts Bearer scheme', () => {
    const ex = new AuthorizationBearerExtractor();
    expect(ex.extract({ headers: { authorization: 'Bearer tok' }, query: {} })).toBe('tok');
    expect(ex.extract({ headers: { authorization: 'raw' }, query: {} })).toBeUndefined();
  });

  it('CompositeKeyExtractor returns first hit (LSP: any extractor is substitutable)', () => {
    const composite = new CompositeKeyExtractor([new HeaderKeyExtractor('x-api-public-key'), new AuthorizationBearerExtractor()]);
    expect(composite.extract({ headers: { authorization: 'Bearer b' }, query: {} })).toBe('b');
  });
});

describe('ApiKeyAuthService + TimingSafeApiKeyValidator (DIP: depends on abstractions)', () => {
  it('authorizes with rotation list, rejects unknown', () => {
    const service = new ApiKeyAuthService(new HeaderKeyExtractor('x-api-public-key'), new TimingSafeApiKeyValidator(new TimingSafeKeyComparator()));
    expect(service.authenticate({ headers: { 'x-api-public-key': 'k2' }, query: {} }, ['k1', 'k2']).authorized).toBe(true);
    const bad = service.authenticate({ headers: { 'x-api-public-key': 'nope' }, query: {} }, ['k1']);
    expect(bad).toMatchObject({ authorized: false, reason: 'invalid' });
    expect(service.authenticate({ headers: {}, query: {} }, ['k1'])).toMatchObject({ authorized: false, reason: 'missing' });
  });
});

describe('verifyApiKey (pure, framework-agnostic)', () => {
  it('reads query by default for backward compat, can disable', () => {
    expect(verifyApiKey({ headers: {}, query: { 'x-api-public-key': 's' } }, { apiKey: 's' }).authorized).toBe(true);
    expect(verifyApiKey({ headers: {}, query: { 'x-api-public-key': 's' } }, { apiKey: 's', allowQuery: false }).reason).toBe('missing');
  });

  it('legacy processEnv alias still works', () => {
    expect(verifyApiKey({ headers: { 'x-api-public-key': 'legacy' }, query: {} }, { processEnv: 'legacy' }).authorized).toBe(true);
  });
});

describe('authMiddleware (backward-compatible facade)', () => {
  it('resolves on valid key via default export and named export', async () => {
    await expect(authMiddleware(mockReq({ 'x-api-public-key': 'k' }), mockRes(), { apiKey: 'k' })).resolves.toBeUndefined();
    await expect(NextAuthMiddleware(mockReq({ 'x-api-public-key': 'k' }), mockRes(), { processEnv: 'k' })).resolves.toBeUndefined();
  });

  it('sends 400 when missing, 401 when invalid, and rejects', async () => {
    const res1 = mockRes();
    await expect(authMiddleware(mockReq(), res1, { apiKey: 'k' })).rejects.toMatchObject({ authorized: false, reason: 'missing' });
    expect(res1.statusMock).toHaveBeenCalledWith(400);
    expect(res1.jsonMock).toHaveBeenCalledWith({ error: { message: 'The api public key is required' } });

    const res2 = mockRes();
    await expect(authMiddleware(mockReq({ 'x-api-public-key': 'wrong' }), res2, { apiKey: 'k' })).rejects.toMatchObject({
      authorized: false,
      reason: 'invalid',
    });
    expect(res2.statusMock).toHaveBeenCalledWith(401);
    expect(res2.jsonMock).toHaveBeenCalledWith({ error: { message: 'You are not authorized to call this api' } });
  });
});
