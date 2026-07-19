# flow-payments-demo

A Checkout.com [Flow Web Component](https://www.checkout.com/docs/payments/accept-payments/accept-a-web-payment/build-your-own-flow) integration demo, written in strict TypeScript.

## Stack

- Express 5, server-rendered with EJS (`views/`)
- TypeScript everywhere (`strict: true`, no `any`) — server bundled with `tsc`, client scripts compiled with `tsc` (`module: none`, no bundler needed since there are no local imports on the client)
- Tailwind CSS v4 (CLI-based, no bundler dependency)
- ESLint (flat config, `typescript-eslint` type-checked rules) + Prettier

## Setup

```
npm install
cp .env.example .env   # then fill in your Checkout.com sandbox credentials
```

Required environment variables (see `.env.example`):

- `CKO_SECRET_KEY` — your sandbox secret key
- `CKO_PUBLIC_KEY` — your sandbox public key
- `CKO_PROCESSING_CHANNEL_ID` — your processing channel id
- `CKO_ENVIRONMENT` — `sandbox` or `production`
- `CKO_API_URL` — Checkout.com payment sessions endpoint
- `PORT` — defaults to `3000`

## Scripts

- `npm run dev` — runs the server (via `tsx watch`), the client TS compiler, and the Tailwind CLI, all in watch mode
- `npm run build` — compiles client, server, and CSS for production
- `npm start` — runs the compiled server from `dist/`
- `npm run typecheck` — type-checks server and client without emitting
- `npm run lint` / `npm run lint:fix` — ESLint
- `npm run format` / `npm run format:check` — Prettier

## Layout

```
src/server/   Express app, routes, env validation
src/client/   Browser scripts (compiled to public/js/, loaded via <script>)
src/types/    Ambient types for the Checkout Web Components CDN global
views/        EJS templates
public/       Static assets + compiled client JS/CSS (js/, css/ are build output, gitignored)
```
