# BAFROVT — Frontend

React + Vite + TypeScript fintech application.

## Setup

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run lint     # ESLint check
```

## Environment

Create `frontend/.env.local`:

```
VITE_API_URL=http://localhost:3000/api
```

The Axios client reads this at `src/services/api.ts`. All service calls will hit this base URL once the backend is running.

## Folder Architecture

```
src/
├── components/
│   ├── ui/              # Shared design system (Button, Input, Card, Modal, Loader, Table, Badge)
│   ├── auth/            # LoginForm, RegisterForm, ProtectedRoute
│   ├── chat/            # ChatWindow, ChatInput, MessageBubble, TypingIndicator, VoiceButton
│   ├── dashboard/       # Persona B: charts, summary cards
│   ├── transactions/    # Persona B: filters, transaction list
│   ├── recommendations/ # Persona B: recommendation cards
│   └── config/          # Persona B: settings panels
├── pages/               # One component per route
├── hooks/               # useAuth, useChat, useVoice, useSocket, useTransactions, useAnalytics
├── services/            # api.ts (Axios), *.service.ts files
├── store/               # Zustand: authStore, chatStore
├── types/               # Shared TypeScript interfaces
├── routes/              # ROUTES constants
├── layouts/             # MainLayout (sidebar + navbar + outlet)
└── lib/                 # cn() utility (clsx + tailwind-merge)
```

## Design System Colors

| Token               | Hex       | Tailwind class          |
|---------------------|-----------|-------------------------|
| Primary             | `#2563EB` | `bg-primary`            |
| Primary hover       | `#1D4ED8` | `bg-primary-hover`      |
| Secondary           | `#38BDF8` | `bg-secondary`          |
| Background light    | `#F8FAFC` | `bg-background-light`   |
| Background dark     | `#0F172A` | `bg-background-dark`    |
| Card light          | `#FFFFFF` | `bg-card-light`         |
| Card dark           | `#1E293B` | `bg-card-dark`          |
| Text light          | `#0F172A` | `text-text-light`       |
| Text dark           | `#F1F5F9` | `text-text-dark`        |
| Success             | `#22C55E` | `text-success`          |
| Error               | `#EF4444` | `text-error`            |
| Warning             | `#F59E0B` | `text-warning`          |

All colors are defined in `src/index.css` under `@theme {}` (Tailwind v4).

## Routing

| Path              | Component           | Protected |
|-------------------|---------------------|-----------|
| `/login`          | LoginPage           | No        |
| `/register`       | RegisterPage        | No        |
| `/dashboard`      | DashboardPage       | Yes*      |
| `/chat`           | ChatPage            | Yes*      |
| `/transactions`   | TransactionsPage    | Yes*      |
| `/recommendations`| RecommendationsPage | Yes*      |
| `/config`         | ConfigPage          | Yes*      |

*`ProtectedRoute` is implemented but commented out in `App.tsx` until backend auth is ready. To enable it, uncomment the `<Route element={<ProtectedRoute />}>` wrapper.

## Persona A — Auth + Chat + Voice

**Files to work on:**
- `src/components/auth/LoginForm.tsx` — wire `useAuth().login`
- `src/components/auth/RegisterForm.tsx` — wire `useAuth().register`
- `src/components/auth/ProtectedRoute.tsx` — already implemented
- `src/components/chat/ChatWindow.tsx` — message list, auto-scroll
- `src/components/chat/ChatInput.tsx` — text + Enter submit
- `src/components/chat/VoiceButton.tsx` — mic toggle
- `src/hooks/useAuth.ts` — calls `authService`, updates `authStore`
- `src/hooks/useChat.ts` — sends to `chatService`, updates `chatStore`
- `src/hooks/useVoice.ts` — MediaRecorder API
- `src/hooks/useSocket.ts` — socket.io-client connection
- `src/services/authService.ts` — `/auth/*` endpoints
- `src/services/chatService.ts` — `/chat/*` endpoints
- `src/services/voiceService.ts` — `/voice/transcribe` + `/voice/synthesize`
- `src/services/socketService.ts` — connect / disconnect helpers
- `src/store/authStore.ts` — Zustand, persisted token + user
- `src/store/chatStore.ts` — Zustand, messages + isTyping

When auth is ready, enable `ProtectedRoute` in `App.tsx`.

## Persona B — Dashboard + Transactions + Config

**Files to work on:**
- `src/pages/DashboardPage.tsx` — summary cards + charts (recharts)
- `src/pages/TransactionsPage.tsx` — replace mock data with `useTransactions()`
- `src/pages/RecommendationsPage.tsx` — replace mock with `useAnalytics()` / recommendation service
- `src/pages/ConfigPage.tsx` — profile + notification settings
- `src/components/dashboard/` — chart components, KPI cards
- `src/components/transactions/` — filters, pagination
- `src/components/config/` — settings forms
- `src/hooks/useTransactions.ts` — queries `transactionService.getAll`
- `src/hooks/useAnalytics.ts` — queries `analyticsService.getSummary` + `getTrends`
- `src/services/transaction.service.ts` — `/transactions` endpoints
- `src/services/analytics.service.ts` — `/analytics/*` endpoints
- `src/services/recommendation.service.ts` — `/recommendations` endpoints

## Stack

| Library                | Version  | Purpose                       |
|------------------------|----------|-------------------------------|
| React                  | 19       | UI framework                  |
| Vite                   | 8        | Build tool                    |
| TypeScript             | 6        | Type safety                   |
| Tailwind CSS           | 4        | Styling (CSS-first config)    |
| React Router DOM       | 7        | Client-side routing           |
| Zustand                | 5        | Global state (auth, chat)     |
| @tanstack/react-query  | 5        | Server state / data fetching  |
| Axios                  | 1        | HTTP client                   |
| Socket.IO Client       | 4        | Real-time WebSocket           |
| Recharts               | 3        | Charts for dashboard          |
| Lucide React           | latest   | Icons                         |
| clsx + tailwind-merge  | —        | Conditional Tailwind classes  |

## Git Workflow

```
main          — stable, protected
frontend      — active feature branch (this one)
backend       — backend team branch
```

**Recommended flow:**
1. Pull `frontend` before starting any session
2. Create a feature branch: `git checkout -b feat/persona-a/login`
3. Open a PR into `frontend` when ready
4. One person reviews before merging
5. Merge `frontend` → `main` when a full feature set is complete

Never commit directly to `main`.
