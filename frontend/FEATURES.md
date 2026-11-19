# Watchtower frontend features

## Documentation

- Added `BUILD_FRONTEND.md` with API-driven implementation rules, frontend-only scope, verification guidance, and the required `FEATURES.md` handoff workflow.

## Implemented

- Replaced project and environment card grids with responsive data tables containing resource names, descriptions, counts/status, full IDs, and row actions.
- Replaced hash navigation with History API routes: `/`, `/projects`, `/projects/{project_id}`, `/projects/{project_id}/environments/{environment_id}`, and `/health`; direct links and browser back/forward preserve resource context.
- Projects workspace with responsive list, loading/empty/error states, create/edit forms, deletion confirmation, and refresh controls.
- Project CRUD integration using `GET/POST /api/v1/projects` and `GET/PUT/DELETE /api/v1/projects/{project_id}` with cookie credentials.
- Defensive project response normalization for the API's open-object list and detail response schemas.
- Fixed project collection parsing for the backend's actual `{ projects: { "<uuid>": { id, name, description } } }` response and added handling for 200-level `{ error }` mutation responses.
- Project environment workspace opened from each project, with responsive list, loading/empty/error states, create and edit forms, and project-level environment counts.
- Environment integration using `GET/POST /api/v1/projects/{project_id}/environments` and `GET/PUT /api/v1/projects/{project_id}/environments/{environment_id}` with UUID-keyed response normalization. Environment deletion is intentionally omitted because the API does not expose it.
- Cleaned `src/App.jsx` so it only handles session restoration, page selection, navigation, and layout composition; feature UI and API calls remain in their designated modules.
- Reorganized the frontend according to `APP_STRUCTURE_BLUEPRINT.md`: pages, layouts, reusable components, API services, health polling hooks, and styles now live in their designated `src/` folders.
- Split page/chrome styling into `src/styles/auth.css`, `src/styles/dashboard.css`, `src/styles/health.css`, and `src/styles/header.css`, imported from `src/main.jsx`.

- Sticky header remains visible while scrolling.
- Dedicated Service health page is accessible from the header navigation; Overview no longer owns the health cards.

- Sign in with `POST /api/v1/auth/login`.
- Create an account with `POST /api/v1/auth/register`.
- Restore the current session with `GET /api/v1/auth/me`.
- Sign out with `POST /api/v1/auth/logout`.
- Cookie-aware requests using `credentials: include`.
- Responsive control-room dashboard with service status cards.
- Health probes for `GET /api/v1/health`, `/api/v1/health/ready`, and `/api/v1/health/live`.
- Manual health refresh and automatic refresh every 10 minutes while the dashboard is open.
- `VITE_API_URL` configuration with a `http://localhost:8000` fallback.
- Auth, loading, error, operational, unavailable, and pending states.

## API assumptions

- Authentication request bodies use `{ username, password }`.
- The API sets/reads the authenticated session through cookies.
- Health endpoints return JSON objects; the UI renders the optional `message` field and safely handles other response shapes.
- Project responses may wrap records under `projects`, `items`, `results`, or `data`; the frontend also accepts direct arrays, keyed objects, and individual project objects.
