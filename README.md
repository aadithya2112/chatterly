# Chatterly – Embeddable AI Chat Widget with Analytics

An AI-powered chat widget you can drop into any website, plus a modern dashboard to track user conversations and analytics.

## Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
   1. [Prerequisites](#prerequisites)
   2. [Install & Dev](#install--dev)
   3. [Environment Variables](#environment-variables)
5. [Project Structure](#project-structure)
6. [Embedding the Widget](#embedding-the-widget)
7. [Deployment & Demos](#deployment--demos)
8. [Challenges & Solutions](#challenges--solutions)
9. [Contributing](#contributing)
10. [License](#license)

---

## Features

- **Embeddable Widget:** AI chat powered by WebSocket + Express API
- **Multi-user Support:** Each user can mint multiple widgets
- **Analytics Dashboard:** Conversation metrics, usage trends, and more
- **Zero-Config Embed:** Copy & paste a single `<script>` tag
- **Real-time Updates:** Socket.io for live chat sessions

## Architecture

I used a **monorepo** with [Turborepo](https://turborepo.org/) & Bun:

- **apps/chat-widget** – React + Vite embeddable widget
- **apps/web** – Next.js dashboard & HTTP API
- **apps/backend** – Bun + Express + Socket.io server
- **packages/db** – Prisma client & database layer
- **packages/ui** – Shared React components

### Data Flow

1. Widget opens a WebSocket to `backend` → streams user messages.
2. Backend invokes AI via `@google/genai` → pushes responses back.
3. REST calls from `web` (Next.js) read/write analytics via `packages/db`.
4. Dashboard UI shows aggregated metrics and real-time sessions.

## Tech Stack

- **Language**: TypeScript
- **Frameworks**: React, Next.js, Express, Socket.io
- **Bundler**: Vite (widget), Turbo (monorepo)
- **Runtime**: Node.js ≥18 & [Bun](https://bun.sh/)
- **DB**: Prisma + PostgreSQL database of choice
- **Deployment**: Digital Ocean, GitHub Pages (widget via `gh-pages`)

## Getting Started

### Prerequisites

- Node.js ≥18
- [Bun](https://bun.sh/) v1.2.9+ (for backend & db)
- (Optional) Yarn, npm or pnpm

### Install & Dev

Clone & install:

```bash
git clone https://github.com/your-org/chatterly.git
cd chatterly
# install everything
bun install   # or `npm install` if you prefer
```

Run all services in dev mode:

```bash
npm run dev
# → dashboard & widget & backend start concurrently
```

Individually:

- **Dashboard (Next.js)**
  ```bash
  cd apps/web && npm run dev
  ```
- **Widget (Vite)**
  ```bash
  cd apps/chat-widget && npm run dev
  ```
- **Backend (Socket.io)**
  ```bash
  cd apps/backend && bun src/index.ts
  ```

### Environment Variables

Create a `.env` (for each app) from `.env.example`:

```env
# apps/backend/.env
PORT=4000
DATABASE_URL="postgres://user:pass@localhost:5432/db"
GOOGLE_GENAI_API_KEY="…"

# apps/web/.env
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NEXT_PUBLIC_WS_URL="ws://localhost:4000"
# plus any auth keys
```

## Project Structure

```
/
├─ apps/
│  ├─ chat-widget/      # React widget (Vite)
│  ├─ web/              # Dashboard & HTTP API (Next.js)
│  └─ backend/          # WebSocket server (Bun + Express)
└─ packages/
    ├─ db/               # Prisma client & migrations
    └─ ui/               # Shared React components
```

## Embedding the Widget

Once you’ve built & deployed `apps/chat-widget` (→ GitHub Pages or your CDN), add this to any HTML:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Load the chat widget -->
    <script
      defer
      src="https://YOUR_CDN_URL/chat-widget.js"
      data-widget-id="WIDGET_ID"
      data-api-url="https://dashboard.yoursite.com/api"
      data-ws-url="wss://api.yoursite.com"
    ></script>
  </head>
  <body>
    <h1>My page with AI Chat</h1>
  </body>
</html>
```

- `data-widget-id`: Unique ID from your Dashboard
- `data-api-url`: REST endpoints for auth/analytics
- `data-ws-url`: WebSocket endpoint for live chat

## Deployment & Demos

- **Widget Demo** (GitHub Pages): [https://your-org.github.io/chat-widget](https://your-org.github.io/chat-widget)
- **Dashboard Demo** (Vercel): [https://chatterly-dashboard.vercel.app](https://chatterly-dashboard.vercel.app)

Replace these with your actual URLs once deployed.

## Challenges & Solutions

- **CORS & WebSocket Upscaling**  
  Enabled wildcard CORS on Socket.io; for production, lock to whitelisted domains.
- **Monorepo Builds**  
  Leveraged Turborepo cache to parallelize builds & reduce CI time by 70%.
- **Shared Types**  
  Configured `packages/typescript-config` & workspace path aliases to avoid duplication.

## Contributing

1. Fork & clone
2. Create a feature branch
3. Install & run `npm run dev`
4. Submit PR & describe your changes

## License

MIT
