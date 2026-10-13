# Nextjs Auth Middleware

<a href="https://www.npmjs.com/package/nextjs-auth-middleware"><img src="https://img.shields.io/npm/v/nextjs-auth-middleware.svg?style=flat-square" alt="Current Release" /></a>
<a href="https://www.npmjs.com/package/nextjs-auth-middleware"><img src="https://img.shields.io/npm/dm/nextjs-auth-middleware?style=flat-square" alt="Downloads" /></a>
<a href="https://github.com/abrahamcalsindev/nextjs-auth-middleware/blob/main/LICENSE"><img alt="npm" src="https://img.shields.io/github/license/abrahamcalsindev/react-github-fork-banner?style=flat-square" alt="License"></a>

`Nextjs-Auth-Middleware` is a lightweight (~0.5 kB brotli, zero runtime deps) middleware for adding API key authentication to secure an API route in Next.js. Compatible with Next.js 12–16 (Pages Router `pages/api`).

> pages/api/your-api.{ts,js}

## Installation

```bash
npm install --save nextjs-auth-middleware@latest
# or
yarn add nextjs-auth-middleware@latest
# or
pnpm add nextjs-auth-middleware@latest
```

Requires `node >=20.9.0` for development. `next` is an optional peer (`>=12 <17`).

## Usage

```typescript
import NextAuthMiddleware from 'nextjs-auth-middleware';

async function handler(req, res) {
  try {
    await NextAuthMiddleware(req, res, {
      processEnv: process.env.API_ROUTE_KEY, // optional, default is API_ROUTE_PUBLIC_KEY
      // apiKey: process.env.API_ROUTE_KEY, // preferred alias, supports string[] for rotation
      // headerName: 'x-api-key', // optional, default 'x-api-public-key'
      // allowQuery: false, // optional, default true for backward compat
    });
  } catch {
    return; // response already sent with 401
  }

  res.json({ message: 'Hello NextJs Auth! 🚀' });
}

export default handler;
```

Also accepts `Authorization: Bearer <key>`. Key comparison uses a timing-safe compare.

## Keep in touch with me

- GitHub: [@abrahamcalsindev](https://github.com/abrahamcalsindev)
- Twitter: [@abraham_calsin](https://twitter.com/abraham_calsin)

## License

This project is licensed under [License.](LICENSE)
