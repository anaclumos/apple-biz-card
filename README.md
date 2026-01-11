# Apple Wallet Biz Card

Digital business card for Sunghyun Cho. Generates `.pkpass` for Apple Wallet.

## Setup

```bash
pnpm install
cp .env.example .env  # Configure your certificates
pnpm dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PASS_CERTIFICATE_PEM_BASE64` | Pass Type ID certificate (base64) |
| `PASS_KEY_PEM_BASE64` | Private key (base64) |
| `WWDR_CERTIFICATE_PEM_BASE64` | Apple WWDR G4 certificate (base64) |
| `PASS_TYPE_IDENTIFIER` | e.g., `pass.com.yourname.card` |
| `TEAM_IDENTIFIER` | 10-character Apple Team ID |
| `ADMIN_PASSWORD` | Password for `/set-default` admin page |

## Features

- Apple Wallet pass generation with visitor tracking
- 20 languages supported
- Admin page to set default meeting places by date
- In-app browser detection & redirect

## Tech Stack

Next.js 16 · React 19 · Drizzle ORM · passkit-generator · shadcn/ui · Tailwind
