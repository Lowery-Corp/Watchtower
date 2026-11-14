# Watchtower App Structure Blueprint

Watchtower is a full-stack application organized as a React/Vite frontend, a FastAPI backend, and local infrastructure managed by Docker Compose.

```text
Watchtower/
├── frontend/                 # React/Vite browser application
├── backend/                  # FastAPI HTTP API
├── postgres/                 # PostgreSQL initialization scripts
├── docker-compose.yaml       # Local multi-service runtime
├── README.md                 # Setup and operational notes
└── LICENSE
```

## Runtime Architecture

```text
Browser
  |
  v
React/Vite frontend (:5173)
  |
  v
FastAPI backend (:8000)
  |
  +--> PostgreSQL
  +--> Redis cache
```

The frontend communicates with the backend using JSON HTTP requests. Authentication is cookie-based: browser requests must include credentials so the session cookie is sent to the API. The API base URL is configured with `VITE_API_URL` and defaults to `http://localhost:8000`.

## Frontend: `frontend/`

```text
frontend/
├── Dockerfile
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .env
├── .env.example
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    ├── hooks/
    ├── layouts/
    ├── pages/
    ├── services/
    └── styles/
```

### Frontend Root Files

| Path | Purpose |
| --- | --- |
| `package.json` | React/Vite package metadata, scripts, and dependencies. |
| `package-lock.json` | Locked npm dependency graph. |
| `Dockerfile` | Container definition for the frontend development service. |
| `index.html` | Vite document entry point. |
| `vite.config.js` | Vite and React build configuration. |
| `.env` / `.env.example` | Frontend environment values, including the API URL. Keep secrets out of committed files. |
| `APP_STRUCTURE_BLUEPRINT.md` | This architecture reference. |

### Frontend Source Layout

| Path | Purpose |
| --- | --- |
| `src/main.jsx` | Bootstraps React and mounts the application into the page. |
| `src/App.jsx` | Application shell, session boundary, and page selection. |
| `src/index.css` | Global styles, responsive layout, dashboard components, auth screen, status states, and theme tokens. |
| `src/pages/` | Route-level screens: authentication, overview, and service health. |
| `src/layouts/` | Shared auth and authenticated dashboard page chrome, including the sticky header and footer. |
| `src/components/` | Reusable feature UI such as the auth form and health status cards. |
| `src/services/` | API client plus auth and health endpoint wrappers. |
| `src/hooks/` | Reusable React behavior, including 10-minute health polling. |
| `src/styles/` | Page- and chrome-specific stylesheets imported by `main.jsx`. |

### What Belongs In Each `src/` Folder

The current frontend is intentionally small, but new code should follow this separation as the application grows:

| Folder or file | Store here | Do not store here |
| --- | --- | --- |
| `src/main.jsx` | React bootstrap code, root providers, and the DOM mount call. | Feature UI, API requests, or page-specific logic. |
| `src/App.jsx` | Top-level application composition, route selection, session boundaries, and cross-feature orchestration. | Large reusable widgets, raw fetch logic for unrelated domains, or global CSS. |
| `src/index.css` | CSS reset, design tokens, typography, global layout primitives, accessibility defaults, and shared utility classes. | Component-specific business logic or API response handling. |
| `src/assets/` | Images, icons, fonts, and other assets imported by JavaScript or CSS. | User-uploaded runtime files or secrets. |
| `src/components/` | Reusable presentational components and small interaction units shared by multiple pages or features. | Route-level data loading or one-off screen composition. |
| `src/components/<feature>/` | Components that belong to one feature, such as `health/`, `auth/`, or `monitoring/`, when that feature has several related pieces. | Components that are only used by another single component; keep those colocated instead. |
| `src/pages/` | Route-level screens that compose layouts, load feature data, and define page-specific states. | Generic buttons, cards, inputs, or API clients. |
| `src/layouts/` | Shared page chrome such as authenticated shells, navigation, headers, sidebars, and public/auth layouts. | Domain-specific data fetching or database models. |
| `src/services/` | Browser API clients, request helpers, authentication calls, health probes, serializers, and integrations with external services. | JSX markup or visual styling. |
| `src/hooks/` | Reusable React hooks for behavior such as polling, session state, media queries, and request lifecycle state. | Static UI markup or backend-only code. |
| `src/context/` | React context providers for app-wide state, such as the authenticated user, theme, or notifications. | Every piece of local component state. |
| `src/lib/` | Small framework-agnostic utilities, constants, formatters, and validation helpers. | Components, route definitions, or network side effects. |
| `src/types/` | Shared TypeScript types or schema declarations if the frontend is migrated to TypeScript. | Runtime API calls or rendered UI. |

For a new feature, prefer this shape:

```text
src/
└── components/<feature>/    # Feature UI pieces
    pages/<FeaturePage>      # Route-level screen, if needed
    services/<feature>.js    # API calls and response mapping
    hooks/use<Feature>.js    # Reusable feature behavior, if needed
```

Keep feature-specific code close together. Promote a component, hook, or utility to a shared folder only after it is genuinely reused by multiple feature areas.

### Frontend Feature Surface

The current API-backed UI maps to these capabilities:

| UI capability | API endpoint |
| --- | --- |
| Sign in | `POST /api/v1/auth/login` |
| Create account | `POST /api/v1/auth/register` |
| Restore current session | `GET /api/v1/auth/me` |
| Sign out | `POST /api/v1/auth/logout` |
| API health card | `GET /api/v1/health` |
| Readiness card | `GET /api/v1/health/ready` |
| Liveness card | `GET /api/v1/health/live` |

Health probes can be refreshed manually and are automatically refreshed every 10 minutes while the dashboard tab remains open.

## Backend: `backend/`

```text
backend/
├── Dockerfile
├── requirements.txt
├── alembic.ini
├── main.py
├── __init__.py
├── api/
├── auth/
├── cache/
├── core/
├── db/
├── httpxC/
├── middleware/
├── models/
├── repositories/
├── schemas/
└── alembic/
```

### Backend Root Files

| Path | Purpose |
| --- | --- |
| `main.py` | FastAPI application entry point. Creates the app, registers middleware, and mounts `/api/v1`. |
| `requirements.txt` | Python runtime dependencies. |
| `Dockerfile` | Container definition for the API service. |
| `alembic.ini` | Alembic migration configuration. |
| `__init__.py` | Marks the backend as a Python package. |

### Backend Source Directories

| Path | Purpose |
| --- | --- |
| `api/` | API router composition and versioned endpoint modules. |
| `auth/` | Authentication dependencies and current-user resolution. |
| `cache/` | Redis connection, cache dependencies, and cache helpers. |
| `core/` | Application configuration and retry utilities. |
| `db/` | SQLAlchemy engine, session setup, and database dependencies. |
| `httpxC/` | Shared outbound HTTP client wrapper. |
| `middleware/` | Request middleware, currently including request ID handling. |
| `models/` | SQLAlchemy ORM models, including login logging. |
| `repositories/` | Persistence and auth data-access operations, including token blacklist behavior. |
| `schemas/` | Pydantic request and response schemas. |
| `alembic/` | Migration environment, templates, and migration versions. |

### Backend API Pattern

```text
api/
└── v1/
    ├── api.py
    └── endpoints/
        ├── auth.py
        ├── health.py
        └── health copy.py
```

`backend/api/v1/api.py` composes the versioned router. The currently documented routes are:

| Router | Prefix | Purpose |
| --- | --- | --- |
| `auth.router` | `/api/v1/auth` | Registration, login, current-user lookup, and logout. |
| `health.router` | `/api/v1/health` | Basic health, readiness, and liveness probes. |

### Backend Data and Infrastructure Flow

- `main.py` starts the FastAPI application and includes the versioned API router.
- Endpoint modules validate request and response data through `schemas/`.
- Authentication endpoints use repository functions and issue a session cookie.
- Database access is provided through `db/session.py` and FastAPI dependencies in `db/dependencies.py`.
- Redis access is centralized under `cache/`.
- Alembic migrations under `alembic/versions/` evolve the PostgreSQL schema.

## Development Conventions

- Keep browser-only concerns in `frontend/src/`.
- Keep API routing, validation, persistence, and infrastructure concerns in `backend/`.
- Add new API capabilities under `backend/api/v1/endpoints/`, then include the router in `backend/api/v1/api.py`.
- Add corresponding browser request helpers and UI states in `frontend/src/App.jsx` or split them into feature modules as the frontend grows.
- Preserve `credentials: include` for authenticated browser requests.
- Update this blueprint when adding a new top-level directory, API router, or frontend feature area.
