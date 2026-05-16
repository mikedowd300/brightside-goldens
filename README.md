# Brightside Goldens

A starter web app for Brightside Goldens with:

- Angular standalone frontend
- Node/Express backend
- JSON file persistence in `server/data/site-data.json`

## Local development

- `npm install`
- `npm start`

The Angular app runs on port `4200` and the Node API runs on port `3000`.

## Split frontend/backend deployment

This repo now supports deploying the frontend and backend separately.

### Recommended production split

- frontend: GitHub Pages
- backend: Railway Hobby

### Railway backend

Deploy the Express server from:

- `server/server.js`

Requirements:

- persistent volume for the site JSON file
- `ALLOWED_ORIGINS` set to the frontend origin(s), comma-separated
- Cloudinary env vars if you want live Cloudinary browsing
- `DATA_FILE_PATH` pointing at the mounted volume file location

Example:

- `ALLOWED_ORIGINS=https://brightsidegoldens.com`
- `DATA_FILE_PATH=/app/data/site-data.json`

Important Railway note:
- mount a Railway volume at `/app/data`
- the app will seed `site-data.json` from the bundled repo copy if that volume file does not exist yet

Files involved:
- backend runtime config: `railway.json`
- bundled seed data: `server/data/site-data.json`

### GitHub Pages frontend

The frontend reads a runtime config file from:

- `public/env.js`

For local development, `public/env.js` stays blank and the app uses same-origin `/api/...`.

For GitHub Pages production deploys, the GitHub Actions workflow writes `public/env.js`
at build time from the repository variable `API_BASE_URL`.

Set this GitHub repository variable to your Railway backend URL, for example:

- `API_BASE_URL=https://your-railway-service.up.railway.app`

GitHub Pages workflow:
- `.github/workflows/deploy-pages.yml`

Custom domain support:
- `public/CNAME` is set to `brightsidegoldens.com`

### Local frontend target switching

Your local frontend can now talk to either:
- the local backend
- the production Railway backend

The frontend supports a browser-persisted override through the `apiBaseUrl` query param.

Examples:

- use same-origin local backend:
  - `http://127.0.0.1:4200/?apiBaseUrl=same-origin`
- use a deployed Railway backend:
  - `http://127.0.0.1:4200/?apiBaseUrl=https://your-railway-service.up.railway.app`

Behavior:
- the override is saved in browser local storage
- after the first load, the query param is removed from the URL
- the chosen backend remains active until you switch it again

### Deployment checklist

1. Create a Railway service from this repo.
2. Add a Railway volume mounted at `/app/data`.
3. Set Railway env vars:
   - `ALLOWED_ORIGINS=https://brightsidegoldens.com`
   - `DATA_FILE_PATH=/app/data/site-data.json`
   - `CLOUDINARY_CLOUD_NAME=...`
   - `CLOUDINARY_API_KEY=...`
   - `CLOUDINARY_API_SECRET=...`
4. Confirm Railway backend health at `/api/health`.
5. In GitHub, set repository variable `API_BASE_URL` to the Railway public backend URL.
6. Enable GitHub Pages with GitHub Actions.
7. Push to `main` to deploy the frontend.
8. Point the custom domain to GitHub Pages.

## Combined deployment

This project is set up so the Node server can serve the built Angular app and
the API together from one service.

- `npm install`
- `npm run build`
- `npm run serve:prod`

In production, the Node server serves the Angular files from
`dist/brightside-goldens/browser` and keeps the API available under `/api`.
