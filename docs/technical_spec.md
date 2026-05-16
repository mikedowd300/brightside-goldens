# Brightside Goldens Technical Specification

## Repo

- Project root: [/Users/mikedowd/brightside-goldens](/Users/mikedowd/brightside-goldens)
- Branch checked during this pass: `main`
- Git working tree state during this pass: clean

## Stack

Frontend:
- Angular 20 standalone application
- TypeScript
- SCSS

Backend:
- Node.js
- Express 5

Other runtime integrations:
- EmailJS browser SDK for contact form delivery
- optional Cloudinary asset listing via server API
- Zod for content-schema validation in the admin editor

## High-Level Architecture

This is a combined site application:
- Angular renders the public site and the internal editor
- Express serves JSON APIs
- Express is also set up to serve the built Angular app from `dist/brightside-goldens/browser`

Local development:
- frontend dev server on `4200`
- backend server on `3000`
- Angular proxies `/api` to the backend using `proxy.conf.json`

Deployment note:
- the frontend can now be deployed separately and pointed at a different backend origin using `public/env.js`

## Frontend Routes

Defined in [/Users/mikedowd/brightside-goldens/src/app/app.routes.ts](/Users/mikedowd/brightside-goldens/src/app/app.routes.ts)

- `/`
- `/home`
- `/puppies`
- `/our-boys`
- `/our-girls`
- `/about-us`
- `/contact-us`
- `/faqs`
- `/brightside-studio`
- `/admin` redirects to `/`
- unknown routes redirect to `/`

## Main Frontend Areas

Shell:
- `app.component.*`

Pages:
- `pages/home`
- `pages/puppies`
- `pages/our-boys`
- `pages/our-girls`
- `pages/about-us`
- `pages/contact-us`
- `pages/faqs`
- `pages/admin`

Reusable public components:
- `page-layout`
- `dog-card`
- `litter-showcase`
- `footer-links`

Reusable admin components:
- `admin-slide-editor`
- `admin-litter-editor`
- `admin-dog-editor`
- `admin-faq-editor`
- `admin-image-field`
- `cloudinary-file-selector`

## Data Model

The primary content model lives in:
- [/Users/mikedowd/brightside-goldens/src/app/site-content.ts](/Users/mikedowd/brightside-goldens/src/app/site-content.ts)

The schema validator lives in:
- [/Users/mikedowd/brightside-goldens/src/app/site-content.schema.ts](/Users/mikedowd/brightside-goldens/src/app/site-content.schema.ts)

Top-level content sections:
- `brand`
- `home`
- `puppies`
- `ourBoys`
- `ourGirls`
- `aboutUs`
- `contactUs`
- `faqs`

Notable model behavior:
- FAQs store `answer` as `string[]`
- dogs support multiple images and optional detail lists
- `active` dogs are filtered before public rendering
- litters include `status`, `sire`, `mother`, and optional `puppyImages`
- litter parent records reference dog pages by `dogAnchorId`

Supported litter statuses:
- `PLANNED`
- `ON_THE_WAY`
- `ARRIVED`
- `HOMED`

## Current Content Source of Truth

Primary persisted content file:
- [/Users/mikedowd/brightside-goldens/server/data/site-data.json](/Users/mikedowd/brightside-goldens/server/data/site-data.json)

Persistence behavior:
- the editor loads the full JSON document
- saves replace the full document
- there is no database
- there is no patch/field-level update API

## Backend API

Backend implementation:
- [/Users/mikedowd/brightside-goldens/server/server.js](/Users/mikedowd/brightside-goldens/server/server.js)

Endpoints:
- `GET /api/health`
- `GET /api/site-data`
- `PUT /api/site-data`
- `GET /api/cloudinary/assets`

Endpoint behavior:
- `GET /api/site-data` returns the entire site content object from disk
- `PUT /api/site-data` writes the request body directly to disk
- `GET /api/cloudinary/assets` returns live Cloudinary assets when credentials are present, otherwise fallback mock assets

Backend deployment requirements:
- a real Node host
- persistent filesystem access for `server/data/site-data.json`
- `ALLOWED_ORIGINS` configured for browser clients when frontend and backend are split across origins
- optional `DATA_FILE_PATH` override when the persisted JSON file should live on a mounted volume path

## Media Sources

There are currently two media patterns in use:
- real Cloudinary URLs already stored inside `server/data/site-data.json`
- fallback demo/mock Cloudinary assets returned by the backend when Cloudinary is not configured

Cloudinary env vars are documented in:
- [/Users/mikedowd/brightside-goldens/.env.example](/Users/mikedowd/brightside-goldens/.env.example)

Current Cloudinary picker behavior:
- backend supports folder filtering through the `prefix` query param
- home image fields default to prefix `brightside-goldens/home`
- dog image fields default to prefix `brightside-goldens/dogs`
- litter puppy image fields default to prefix `brightside-goldens/puppies`
- picker UI also allows manual prefix changes and a fallback “Show All” action

## Contact Form Delivery

The contact form is implemented client-side in:
- [/Users/mikedowd/brightside-goldens/src/app/pages/contact-us/contact-us-page.component.ts](/Users/mikedowd/brightside-goldens/src/app/pages/contact-us/contact-us-page.component.ts)

Current behavior:
- uses EmailJS directly from the browser
- no backend inquiry endpoint exists
- no lead storage exists in this repo

## Admin Access Model

Admin access helper:
- [/Users/mikedowd/brightside-goldens/src/app/admin-access.ts](/Users/mikedowd/brightside-goldens/src/app/admin-access.ts)

Current implementation:
- frontend-only passphrase gate
- passphrase stored in source code
- access persisted in `sessionStorage`

This is convenience access control, not secure backend authorization.

## Public Rendering Notes

Implemented public behavior includes:
- homepage slideshow rotates on a timer
- puppies page hides `HOMED` litters
- litter cards can resolve sire/mother details from dog profiles
- dog cards rotate through multiple dog images
- FAQs use an accordion interaction

## Important Gaps Between Model and Rendering

These are current technical mismatches worth preserving in future planning:

- `contactUs` content exists in the JSON model and admin editor, but the public contact page currently uses hardcoded title, intro, email, phone, and location text.
- `aboutUs.title` and `aboutUs.intro` exist in the model, but the public About page currently renders only `paragraphs`.
- Admin editing for `contactUs` and `faqs` uses the standard save button instead of the floating-save pattern used on several other tabs.
- The top nav only shows `About Us`, `Contact Us`, and `FAQs` while already on the admin route, which means those pages are not directly visible in normal public navigation.

## Frontend Runtime API Configuration

Runtime config file:
- [/Users/mikedowd/brightside-goldens/public/env.js](/Users/mikedowd/brightside-goldens/public/env.js)

Frontend API URL helper:
- [/Users/mikedowd/brightside-goldens/src/app/runtime-config.ts](/Users/mikedowd/brightside-goldens/src/app/runtime-config.ts)

Current behavior:
- if `apiBaseUrl` is blank, the frontend uses same-origin `/api/...`
- if `apiBaseUrl` is set, the frontend calls that backend origin instead
- a local browser override can persist a different `apiBaseUrl` via the `apiBaseUrl` query param and local storage

## Current Preferred Deployment Target

Current preferred split:
- frontend on GitHub Pages
- backend on Railway Hobby

Railway-specific notes:
- use a persistent volume mounted at `/app/data`
- set `DATA_FILE_PATH=/app/data/site-data.json`
- the server seeds that file from the bundled repo copy if the mounted file does not exist yet

GitHub Pages-specific notes:
- `.github/workflows/deploy-pages.yml` writes production `public/env.js` from the GitHub repository variable `API_BASE_URL`
- staged rollout should use the default GitHub Pages project URL first, then add the custom domain at cutover

## Build Status Observed During This Pass

Observed on May 1, 2026:
- `npm run build` started but did not complete successfully in this environment, so a clean production build was not verified during this pass

There is currently no unit-test setup in this repo.

That means the current repo should be treated as partially verified, not fully release-checked.
