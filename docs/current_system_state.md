# Brightside Goldens Current System State

This file is the handoff summary for future Brightside Goldens Codex threads.

Use it with:
- [/Users/mikedowd/brightside-goldens/docs/business_rules.md](/Users/mikedowd/brightside-goldens/docs/business_rules.md)
- [/Users/mikedowd/brightside-goldens/docs/technical_spec.md](/Users/mikedowd/brightside-goldens/docs/technical_spec.md)

## What Exists Right Now

The repo already contains a real working site structure, not just a starter scaffold.

Implemented areas:
- home page
- puppies page
- our boys page
- our girls page
- about page
- contact page
- FAQ page
- internal admin/editor route
- Express API for site data
- JSON persistence
- optional Cloudinary asset browsing

## Current Page Map

Public routes:
- `/`
- `/home`
- `/puppies`
- `/our-boys`
- `/our-girls`
- `/about-us`
- `/contact-us`
- `/faqs`

Internal route:
- `/brightside-studio`

## Current Content Strategy

The site is built around one structured content document in:
- [/Users/mikedowd/brightside-goldens/server/data/site-data.json](/Users/mikedowd/brightside-goldens/server/data/site-data.json)

This is the key architectural fact to preserve.

The project is currently:
- a structured JSON-backed content site
- a single-owner editor workflow
- not a database-backed CMS
- not an e-commerce or account platform

## Current Content/Data Sources

### Primary content

- `server/data/site-data.json`

### Public page rendering

Most public pages read from the site-content JSON through `ContentService`.

Pages that are mostly content-driven right now:
- home
- puppies
- our boys
- our girls
- about us
- FAQs

### Exceptions and hardcoded content

The contact page is not fully content-driven yet.

Current hardcoded values still live in the contact page component/template:
- headline
- intro copy
- email
- phone
- location
- EmailJS service configuration

This is important because the admin editor gives the impression that `contactUs` is fully wired, but it is only partially wired today.

### Media sources

Images currently come from:
- direct Cloudinary URLs saved in the JSON content file
- Cloudinary API asset listing when env vars are configured
- fallback mock asset data when Cloudinary is not configured

Current Cloudinary folder workflow:
- home slideshow pickers default to `brightside-goldens/home`
- dog image pickers default to `brightside-goldens/dogs`
- litter puppy image pickers default to `brightside-goldens/puppies`
- the picker also allows manually changing the folder prefix when needed

## Current Admin Reality

The admin studio is already fairly substantial.

Current capabilities:
- passphrase gate on `/brightside-studio`
- structured editor mode
- raw JSON mode
- add/edit/delete slideshow items
- add/edit/delete home highlights
- add/edit/delete litters
- add/edit/delete dog profiles
- add/edit/delete FAQ items
- edit About Us paragraphs
- edit Contact Us title and intro in the content model

Important caveat:
- access control is frontend-only and not secure for a hardened production admin workflow

## Current Public-Site Behavior

- home rotates slideshow images every 5 seconds
- puppies hides litters with status `HOMED`
- sire and mother references can resolve to dog profiles for richer display
- dog profile cards rotate through multiple images
- only active dogs with a name and image are shown on dog pages
- FAQ uses accordion open/close behavior

## Deployment Approach

The intended deployment model is a combined app:
- build Angular into `dist/brightside-goldens`
- run the Express server
- let Express serve both the API and the built frontend

Local development uses:
- `npm start`
- Angular dev server on `4200`
- Express server on `3000`
- `/api` proxying via `proxy.conf.json`

The repo is now also prepared for split deployment:
- frontend can stay static
- backend can run on a separate Node host
- frontend-to-backend origin is configurable through `public/env.js`
- backend browser access can be constrained with `ALLOWED_ORIGINS`

The current intended production target is:
- GitHub Pages for the frontend
- Railway Hobby for the backend

Backend persistence plan:
- Railway volume mounted at `/app/data`
- `DATA_FILE_PATH=/app/data/site-data.json`
- backend seeds that file from the bundled JSON if the mounted file starts empty

## Known Unfinished Work

This is the most important section for future threads.

### Content cleanup

- placeholder text exists in `server/data/site-data.json`
- some FAQ answers are obvious draft/test text
- some alt text is weak or placeholder quality
- some dog and litter data looks like migrated sample content rather than final production content

### Wiring gaps

- public contact page does not render `contactUs` content from the JSON model
- public About page ignores `aboutUs.title` and `aboutUs.intro`
- some admin-editable fields do not visibly affect the corresponding public page yet

### Security/production concerns

- admin passphrase is hardcoded in frontend code
- admin gating uses `sessionStorage`, not backend auth
- site-data save endpoint writes request bodies directly to disk without server-side schema validation

### Verification gaps

- the repo currently has no unit-test setup
- production build was not successfully verified during this pass

### Navigation/content UX gaps

- top-level public navigation currently emphasizes Home, Puppies, Our Boys, and Our Girls
- About Us, Contact Us, and FAQs are only exposed in the nav while on the admin route
- this is likely not the intended public-site navigation for a breeder website

## Suggested Next Build Steps

If a future thread needs a concrete implementation backlog, start here:

1. Finish wiring content-managed pages so admin edits reliably affect the public site.
2. Clean placeholder/draft content out of `site-data.json`.
3. Fix or simplify test/build verification so the repo has a trustworthy health check.
4. Decide whether the current frontend-only admin gate is acceptable or needs hardening.
5. Revisit public navigation so all core brochure pages are discoverable.

## Working Assumption To Preserve

Future work should assume the right default is:
- keep the structured JSON content model
- improve wiring and polish around it
- avoid unnecessary CMS/database complexity unless business requirements clearly change
