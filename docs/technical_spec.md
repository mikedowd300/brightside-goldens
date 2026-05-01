# Brightside Goldens – Technical Specification

## Core Stack

Frontend:
- Angular standalone app
- TypeScript

Backend:
- Node.js
- Express

Persistence:
- JSON file storage in:
  - `server/data/site-data.json`

Media:
- Cloudinary integration when configured
- fallback mock assets when not configured

---

## Application Shape

This project is a combined content site, not a split frontend/backend product in the same sense as Blackjack Lab.

Current behavior:
- Angular frontend runs on port `4200` in local development
- Express API runs on port `3000` in local development
- production build can be served by the same Node process

The Node server is responsible for:
- serving API routes under `/api`
- serving built Angular files from:
  - `dist/brightside-goldens/browser`

---

## Current Routes

Frontend routes:
- `/`
- `/home`
- `/puppies`
- `/our-boys`
- `/our-girls`
- `/about-us`
- `/contact-us`
- `/faqs`
- `/brightside-studio`

Redirect behavior:
- `/admin` currently redirects to `/`

---

## Content Model

The frontend content model lives in:
- [/Users/mikedowd/brightside-goldens/src/app/site-content.ts](/Users/mikedowd/brightside-goldens/src/app/site-content.ts)

Top-level shape:

```ts
type SiteContent = {
  brand: string;
  home: HomePageContent;
  puppies: PuppiesPageContent;
  ourBoys: PageContent;
  ourGirls: PageContent;
  aboutUs: PageContent;
  contactUs: PageContent;
  faqs: {
    items: FaqItem[];
  };
};
```

Important content subtypes:
- `ImageCard`
- `DogImage`
- `Highlight`
- `DogProfile`
- `FaqItem`
- `LitterRecord`
- `PageContent`

Notable modeling decisions:
- FAQ answers are arrays of strings
- dog profiles support multiple images
- litter records contain:
  - status
  - title
  - timing text
  - ready-to-go-home text
  - sire
  - mother
  - puppy images

Current litter statuses:
- `PLANNED`
- `ON_THE_WAY`
- `ARRIVED`
- `HOMED`

---

## Schema Validation

The content schema is validated in:
- [/Users/mikedowd/brightside-goldens/src/app/site-content.schema.ts](/Users/mikedowd/brightside-goldens/src/app/site-content.schema.ts)

Current direction:
- keep a strongly typed content object
- validate content shape before saving
- preserve predictable rendering across pages

---

## Backend API

Current backend server file:
- [/Users/mikedowd/brightside-goldens/server/server.js](/Users/mikedowd/brightside-goldens/server/server.js)

Current endpoints:
- `GET /api/health`
- `GET /api/site-data`
- `PUT /api/site-data`
- `GET /api/cloudinary/assets`

### `GET /api/health`

Returns simple health JSON.

### `GET /api/site-data`

Reads:
- `server/data/site-data.json`

Returns the current full `SiteContent` object.

### `PUT /api/site-data`

Writes the full site-content object back to:
- `server/data/site-data.json`

Current behavior:
- whole-document replacement save
- not patch-based editing

### `GET /api/cloudinary/assets`

Supports:
- optional `prefix` query param

Current behavior:
- returns live Cloudinary assets if credentials are configured
- falls back to a mock asset list if not

Response shape from frontend service:

```ts
type CloudinaryAssetsResponse = {
  source: 'live' | 'fallback';
  cloudinaryConfigured?: boolean;
  message?: string;
  assets: Array<{
    name: string;
    url: string;
    thumbnailUrl: string;
  }>;
};
```

---

## Frontend Data Access

Current content service:
- [/Users/mikedowd/brightside-goldens/src/app/content.service.ts](/Users/mikedowd/brightside-goldens/src/app/content.service.ts)

Current methods:
- `getSiteContent()`
- `updateSiteContent(content)`
- `getCloudinaryAssets(prefix)`

Current API assumptions:
- frontend uses relative `/api/...` routes
- local proxy behavior is available during development

---

## Admin Studio

Current admin page:
- [/Users/mikedowd/brightside-goldens/src/app/pages/admin/admin-page.component.ts](/Users/mikedowd/brightside-goldens/src/app/pages/admin/admin-page.component.ts)
- [/Users/mikedowd/brightside-goldens/src/app/pages/admin/admin-page.component.html](/Users/mikedowd/brightside-goldens/src/app/pages/admin/admin-page.component.html)

Current access model:
- passphrase-gated frontend access
- uses helpers from:
  - [/Users/mikedowd/brightside-goldens/src/app/admin-access.ts](/Users/mikedowd/brightside-goldens/src/app/admin-access.ts)

Current editor modes:
- `form`
- `json`

Current editable tabs:
- `home`
- `puppies`
- `ourBoys`
- `ourGirls`
- `aboutUs`
- `contactUs`
- `faqs`

Current editor capabilities include:
- add/remove slideshow images
- add/remove home highlights
- edit puppies intro
- add/edit/remove litter records
- add/edit/remove dog profiles
- add/edit/remove FAQ items
- edit About Us paragraphs
- edit Contact Us intro
- switch to raw JSON mode for whole-document editing

Current UX behaviors:
- some tabs use a floating save bar
- unsaved changes are tracked in the editor
- structured mode and raw JSON mode can switch back and forth
- snapshot/reset behavior exists for several major sections

Admin/editor-related components:
- `admin-slide-editor`
- `admin-dog-editor`
- `admin-litter-editor`
- `admin-faq-editor`
- `admin-image-field`
- `cloudinary-file-selector`

---

## Public Page Rendering

Current public page components:
- home
- puppies
- our boys
- our girls
- about us
- contact us
- FAQs

Important display components:
- `page-layout`
- `dog-card`
- `litter-showcase`
- `footer-links`

Current puppies-page behavior:
- filters out `HOMED` litters from the main public litter display
- resolves sire/mother references against dog collections
- can show prior-litter puppy images for planned/on-the-way litters
- can show current puppy strip for arrived litters

---

## Environment Variables

Current env files:
- [/Users/mikedowd/brightside-goldens/.env](/Users/mikedowd/brightside-goldens/.env)
- [/Users/mikedowd/brightside-goldens/.env.example](/Users/mikedowd/brightside-goldens/.env.example)

Known current env category:
- Cloudinary credentials

Expected variables from server behavior:
- `PORT`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

---

## Persistence Model

Current persistence is file-based.

Source of truth:
- `server/data/site-data.json`

This means:
- content persists between server restarts
- there is no database migration layer
- saves replace the full content document

Current tradeoff:
- simple and easy to understand
- but not multi-user safe
- and not ideal for concurrent editing

For the current site, this may still be sufficient.

---

## Current Limitations

Known architectural limitations:
- no real authentication/authorization backend for admin editing
- admin access is passphrase/front-end gated
- no version history for content edits
- no patch/partial save API
- no content locking
- no audit trail

These are not necessarily bugs, but they are important constraints.

---

## Recommended Future Directions

If the site grows, likely future steps would be:
- stronger admin authentication
- server-side authorization for content editing
- patch-based or section-based save endpoints
- content backup/versioning
- richer inquiry/contact workflow if lead handling becomes more important

For now, the current architecture is best understood as:
- structured Angular content editor
- file-backed JSON content store
- Express wrapper and API
