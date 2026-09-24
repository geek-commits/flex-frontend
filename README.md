# FLEX Contact Center

FLEX Contact Center is a web application for handling customer interactions,
supervising contact center operations, and configuring contact center services.
This repository contains the Laravel application and its React frontend.

## Capabilities

- **Agent:** call handling, customer recovery, agent status, and support tools.
- **Supervision:** operational dashboard, agent monitoring, call records,
  campaigns, and reports.
- **Administration:** users, roles, permissions, routing, recordings, and system
  configuration.
- **Platform:** tenant and platform administration surfaces.
- **Omnichannel:** integration entry points for external customer engagement
  systems.

Some areas are proof-of-concept implementations backed by local mock data. The
feature tracker documents current coverage and known backend dependencies in
[`docs/product/FLEX_FEATURE_PARITY.md`](docs/product/FLEX_FEATURE_PARITY.md).

## Technology

- PHP 8.3+ and Laravel 13
- React 19, TypeScript, Inertia.js, and Vite
- Bun for frontend dependencies and scripts
- Pest for backend tests

## Development setup

Install PHP, Composer, Bun, and the database required by your environment. Then
from `my-app/`:

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Configure the database and other required values in `.env`, then run migrations
and install frontend dependencies:

```bash
php artisan migrate
bun install
```

Run the Laravel application and Vite in separate terminals, both from `my-app/`:

```bash
php artisan serve
```

```bash
bun run dev
```

## Verification

Run frontend checks from `my-app/`:

```bash
bun run lint:check
bun run types:check
bun run test
bun run build
```

Run the backend test suite from `my-app/`:

```bash
php artisan test
```

## Product and design guidance

The [`docs/design/`](docs/design/README.md) directory defines the product
workspaces, domain behavior, interaction patterns, accessibility, and canonical
page examples. Runtime code remains authoritative for routes, permissions,
backend behavior, and supported capabilities. Preserve tenant boundaries and
external integration ownership when making changes.

The application is a frontend-focused proof of concept. Do not present mock
data or frontend-only permission checks as production backend enforcement.
