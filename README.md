# Virtual UI

**Live:** [virtual-ui-client.vercel.app](https://virtual-ui-client.vercel.app) ·
**API:** [virtual-ui-server.vercel.app](https://virtual-ui-server.vercel.app)

AI-powered React component generator. Describe a component in plain English, get
production-ready JSX back, preview it live in the browser, save it to your
account — and, as an admin, publish it straight to the
[`virtual-ui-com-lib`](https://www.npmjs.com/package/virtual-ui-com-lib) npm package.

## Packages

| Folder | What it is | Stack |
| --- | --- | --- |
| `virtual-ui-client` | Web app — landing page, generator, live preview, admin dashboard | React 19, Vite 7, Tailwind 4, Redux Toolkit, react-live, Firebase Auth |
| `virtual-ui-server` | REST API — auth, AI generation, credits, payments | Express 5, MongoDB/Mongoose, JWT cookies, OpenRouter, Razorpay |
| `virtual-ui-lib` | Publishable component library that admin-approved components land in | tsup |

## How it works

1. Users sign in with Google (Firebase on the client, JWT httpOnly cookie issued by the server).
2. Every account starts with 150 AI credits; each generation costs 50. Admins generate free.
3. `POST /api/component/generate` sends a heavily constrained system prompt to
   OpenRouter (`deepseek/deepseek-chat`) and gets back strict JSON —
   `{ name, code, props }` — with inline-styles-only, self-contained JSX so it
   renders safely inside the `react-live` sandbox.
4. Users save components to their account. Admins can publish one, which writes
   the file into `virtual-ui-lib/src/components`, appends the export, rebuilds
   with tsup, bumps the patch version and runs `npm publish`.
5. Credits are topped up through Razorpay; the server verifies the payment
   signature with an HMAC before crediting the account.

## Running locally

```bash
git clone https://github.com/PriyanshuChaudhary007/virtual-ui.git
cd virtual-ui
```

Server:

```bash
cd virtual-ui-server && npm install && cp .env.example .env && npm run dev
```

Client (in a second terminal):

```bash
cd virtual-ui-client && npm install && cp .env.example .env && npm run dev
```

Fill in both `.env` files first — see `.env.example` in each folder for the
required keys. You need a MongoDB connection string, a Firebase web app, an
OpenRouter API key and Razorpay test keys.

## API

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/googlesignup` | — | Create/sign in a user, set the JWT cookie |
| `GET` | `/api/auth/logout` | — | Clear the cookie |
| `GET` | `/api/user/currentuser` | cookie | Current user |
| `GET` | `/api/user/all-users` | admin | List users |
| `POST` | `/api/component/generate` | cookie | Generate a component (spends 50 credits) |
| `POST` | `/api/component/save` | cookie | Save to the user's library |
| `POST` | `/api/component/publish` | admin | Build + publish to npm |
| `GET` | `/api/component/all-components` | cookie | List components |
| `POST` | `/api/payment/order` | cookie | Create a Razorpay order |
| `POST` | `/api/payment/verify` | cookie | Verify signature, add credits |

## Deployment

Both apps deploy to Vercel as separate projects.

- **Client** — root directory `virtual-ui-client`, Vite preset. Set
  `VITE_SERVER_URL` to the deployed server URL, plus the Firebase and Razorpay
  public keys.
- **Server** — root directory `virtual-ui-server`, served through `vercel.json`
  as a single Node function. Set every key from `.env.example`, and set
  `CLIENT_URL` to the deployed client origin (comma-separated for multiple).

The auth cookie switches to `SameSite=None; Secure` automatically when
`NODE_ENV=production` or when running on Vercel, so the two domains can share a
session.

### Known limitation

Admin **publish to npm** does not work on serverless hosting — it writes files
to disk and shells out to `npm publish`, which needs a writable filesystem and
a long-lived process. Run the server on a normal host (Railway, Render, a VPS)
if you need that flow, or publish the library manually from `virtual-ui-lib`.
