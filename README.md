# Omega3 — Frontend

A premium, fully-featured project management SaaS frontend — inspired by Linear, Notion, and Vercel Dashboard. Built as a single-page application with React 19 and React Router v7.

![Tech](https://img.shields.io/badge/React-19-149eca) ![Tech](https://img.shields.io/badge/React_Router-7-CA4245) ![Tech](https://img.shields.io/badge/TypeScript-5-3178c6) ![Tech](https://img.shields.io/badge/Tailwind-v4-38bdf8)

---

## Overview

Omega3 lets teams organize work across **workspaces → projects → tasks**, with role-based members, real-time-feeling Kanban boards, activity logging, comments, and a full analytics dashboard. The UI is a dense, keyboard-friendly SaaS interface with full dark/light theme support.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + React Router v7 (SPA mode, `ssr: false`) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + CSS custom properties design system |
| Server state | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| UI primitives | Radix UI (unstyled, themed manually) |
| Charts | Recharts |
| Drag & drop | react-dnd + react-dnd-html5-backend |
| HTTP client | Axios |
| Notifications | Sonner |
| Build tool | Vite |

## Features

- **Authentication** — sign up, email verification via OTP, sign in, forgot/reset password
- **Workspaces** — create, switch, invite members (email or shareable link), role management (admin / member / viewer)
- **Projects** — status tracking (Planning → In Progress → On Hold → Completed/Cancelled), member roles (manager / contributor / viewer), progress tracking
- **Tasks** — Kanban board with drag-and-drop status changes, subtasks, comments, watchers, activity feed, priority & due dates
- **My Tasks** — cross-project personal task view with filters, sort, search, list/board toggle
- **Dashboard** — stat cards, task trend charts, project status breakdown, priority distribution, workspace productivity, recent projects & upcoming tasks widgets
- **Profile** — display name, avatar upload (via backend + Cloudinary), password change
- **Theming** — dark/light mode, persisted to `localStorage`
- **Responsive** — mobile drawer navigation, adaptive grid layouts down to 375px

## Project Structure

```
app/
├── app.css                  # Design tokens (CSS custom properties) + Tailwind v4 theme
├── root.tsx                 # App shell: providers, global Toaster, error boundary
├── routes.ts                # Route configuration (React Router v7)
│
├── types/                   # Domain types (User, Workspace, Project, Task, etc.)
├── lib/
│   ├── api/                 # Typed API functions, grouped by domain
│   ├── schemas/             # Zod validation schemas
│   ├── query-keys.ts         # Centralized TanStack Query key factory
│   ├── constants.ts          # Status/priority config, workspace colors
│   └── utils.ts              # cn(), date formatters, getInitials()
│
├── providers/                # AuthProvider, WorkspaceProvider, ThemeProvider, ReactQueryProvider
├── hooks/
│   ├── mutations/            # useMutation hooks, grouped by domain
│   └── queries/              # useQuery hooks
│
├── components/
│   ├── ui/                   # Base primitives (button, input, badge, dialog, etc.)
│   ├── common/                # Shared non-domain components (empty states, loaders)
│   ├── layout/                # Sidebar, header, mobile nav
│   ├── dashboard/              # Stat cards + chart components
│   ├── workspace/               # Workspace-specific components
│   ├── project/                  # Project cards, Kanban board
│   └── task/                      # Task cards, task detail sub-components
│
└── routes/
    ├── auth/                  # sign-in, sign-up, verify-email, forgot/reset password
    ├── dashboard/               # dashboard, my-tasks, members, workspaces, project, task
    ├── user/                     # profile
    └── root/                      # public home page
```

## Getting Started

### Prerequisites

- Node.js ≥ 20
- A running instance of the [Omega3 backend](#) (or any API matching the contract below)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3000
```

Point this at your backend's base URL — no path prefix (e.g. no `/api-v1`); routes are mounted directly (`/auth`, `/user`, `/workspace`, `/project`, `/task`).

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run start
```

### Type Checking

```bash
npm run typecheck
```

## API Contract

All endpoints return a consistent envelope:

```json
{ "status": 200, "message": "Done", "data": { } }
```

Authenticated requests send `Authorization: Bearer <token>`. A `401` response triggers a global `force-logout` event that clears local state and redirects to sign-in — no manual handling needed when calling the API layer in `lib/api/`.

| Domain | Base path |
|---|---|
| Auth | `/auth` |
| User | `/user` |
| Workspace | `/workspace` |
| Project | `/project` |
| Task | `/task` |

## State Management

| State type | Where it lives |
|---|---|
| Server data | TanStack Query (cache, invalidation via `lib/query-keys.ts`) |
| Auth session | `AuthProvider` — hydrated from `localStorage` on boot |
| Selected workspace | `WorkspaceProvider` — single source of truth, replaces older localStorage/URL-param split |
| Theme | `ThemeProvider` — `dark` / `light` class on `<html>` |
| Filters & view toggles | URL search params (shareable, back-button friendly) |

## Design System

All colors, spacing, and radii are defined as CSS custom properties in `app.css` and consumed via Tailwind's `@theme inline` layer — no hardcoded hex values in components. Status and priority colors are centralized in `lib/constants.ts` so badges stay consistent across every screen.

## Known Considerations

- This app runs in **SPA mode** (`ssr: false` in `react-router.config.ts`) because of heavy `localStorage` usage (auth, workspace selection, theme) — switching back to SSR requires guarding all browser-only access.
- Avatar uploads require the backend's Cloudinary integration to be configured (see backend README).

## License

Private project — all rights reserved.
