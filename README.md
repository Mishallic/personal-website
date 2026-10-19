# personal-website

A portfolio with a terminal interface. Type `help` in the prompt to see the commands.

- `frontend/` React (Create React App) + Redux Toolkit. The CLI, the command processor and the markdown reader.
- `backend/` Express + MySQL. Serves `/projects`, `/blogs` and `/log`.
- `api/` + `vercel.json` Vercel deployment: static frontend plus the backend as a serverless function.

## Run locally

**Full stack with Docker Compose** (frontend on :3000, API on :8000, MySQL on :3308, adminer on :8080):

```sh
cp env_file_example env_file                 # MySQL credentials
cp backend/.example.env backend/.env         # API settings, DB_HOST=mysql inside compose
docker compose -f docker-compose.local.yml up --build
```

**Frontend only** (no database: projects and blog stay empty):

```sh
cd frontend && npm install && npm start
```

**Backend only** against an existing MySQL:

```sh
cd backend && npm install && cp .example.env .env   # edit DB_* in .env
npm start
```

Tests: `cd frontend && CI=true npm test`.

## Deploy on Vercel

The repo root is the Vercel project root. `vercel.json` builds `frontend/` into a static site and
exposes `backend/app.js` through `api/index.js`; rewrites map `/projects`, `/blogs` and `/log` to it.

1. Import the repository on vercel.com, or run `vercel` in the repo root.
2. Add the environment variables from `backend/.example.env` to the project
   (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`), pointing at a MySQL instance
   reachable from Vercel. Without them the site still deploys, and the API answers 500 for
   database-backed routes.
3. Deploy. Production deployments build from `main`.
