# Brightside Goldens – Current System State / Rebuild Guide

This file is the practical handoff document for future Codex threads.

Use it together with:
- [/Users/mikedowd/brightside-goldens/docs/business_rules.md](/Users/mikedowd/brightside-goldens/docs/business_rules.md)
- [/Users/mikedowd/brightside-goldens/docs/technical_spec.md](/Users/mikedowd/brightside-goldens/docs/technical_spec.md)

This document focuses on:
- what is actually built right now
- how the content/editor system currently works
- which implementation decisions are deliberate
- what a new thread should preserve if rebuilding or extending the site

---

## Current Project Identity

Repo:
- [/Users/mikedowd/brightside-goldens](/Users/mikedowd/brightside-goldens)

Project type:
- Angular content site with Node/Express wrapper

Current positioning:
- a breeder/program website for Brightside Goldens
- not an account-based application
- not a database-backed CMS
- not a marketplace or e-commerce system

Current persistence model:
- JSON document in:
  - [/Users/mikedowd/brightside-goldens/server/data/site-data.json](/Users/mikedowd/brightside-goldens/server/data/site-data.json)

---

## What Is Already Built

Public site pages:
- home
- puppies
- our boys
- our girls
- about us
- contact us
- FAQs

Internal editor:
- `/brightside-studio`
- passphrase-gated
- structured editor mode
- raw JSON editor mode

Backend/API:
- site-data read endpoint
- site-data full save endpoint
- Cloudinary asset picker endpoint
- health endpoint

Media/editor support:
- Cloudinary file selector component
- fallback mock Cloudinary assets when credentials are missing

---

## The Most Important Architectural Fact

This site is currently a **structured JSON-backed content system**, not a database-backed CMS.

That means:
- the entire site content is treated as one structured object
- the admin/editor saves the full object back to disk
- rendering depends heavily on the content schema staying stable

This is the central thing a future thread must understand before proposing “simple improvements.”

---

## Current Routing Reality

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

Admin note:
- `/admin` currently redirects to `/`
- the real editor route is `/brightside-studio`

---

## Current Content Model Reality

The frontend content types live in:
- [/Users/mikedowd/brightside-goldens/src/app/site-content.ts](/Users/mikedowd/brightside-goldens/src/app/site-content.ts)

Key implementation details:
- FAQ answers are arrays of strings
- dog profiles support multiple images
- litter records contain parent references plus puppy images
- “Our Boys,” “Our Girls,” “About Us,” and “Contact Us” all use a shared `PageContent` style model

This is not a generic block editor.
It is a site-specific structured content model.

That is a feature, not an accident.

---

## Puppies / Litters Behavior

This is one of the most domain-specific parts of the site.

Current behavior:
- litters use statuses:
  - `PLANNED`
  - `ON_THE_WAY`
  - `ARRIVED`
  - `HOMED`
- the public puppies page filters out `HOMED` litters from the main display
- planned and on-the-way litters can show puppy images from previous litters with the same pairing
- arrived litters can show current-litter puppy images and ready-to-go-home messaging
- sire and mother can resolve against dog profiles by anchor/reference

This means the litter model is doing real presentation work, not just storing text.

---

## Admin Studio Reality

The admin studio is a lightweight internal content editor, not a hardened enterprise admin backend.

Current access model:
- passphrase gate on the frontend

Important implication:
- this is fine for a lightweight internal tool
- but it should not be mistaken for true role-based backend authorization

Current editor modes:
- structured editor
- raw JSON

Current sections/tabs:
- Home
- Puppies
- Our Boys
- Our Girls
- About Us
- Contact Us
- FAQs

Current editing style:
- arrays can be added to and removed from
- content is edited inline
- some tabs show floating save UI
- raw JSON remains available for advanced/manual edits

Important editor components:
- `admin-slide-editor`
- `admin-dog-editor`
- `admin-litter-editor`
- `admin-faq-editor`
- `cloudinary-file-selector`

---

## Current Save Model

There is one especially important implementation decision here:

The save flow is currently **whole-document save**, not field-level patch save.

In practice:
- editor loads the full site-content object
- editor mutates the object
- save writes the full object back through `PUT /api/site-data`

Why this matters:
- simple mental model
- easy to understand and debug
- but not ideal for concurrent editing

Any future refactor should treat this as an intentional simplicity tradeoff.

---

## Current API Surface

Backend file:
- [/Users/mikedowd/brightside-goldens/server/server.js](/Users/mikedowd/brightside-goldens/server/server.js)

Current endpoints:
- `GET /api/health`
- `GET /api/site-data`
- `PUT /api/site-data`
- `GET /api/cloudinary/assets`

What they currently do:
- `GET /api/site-data`
  - returns the full site-content JSON
- `PUT /api/site-data`
  - saves the full site-content JSON
- `GET /api/cloudinary/assets`
  - loads live Cloudinary assets if configured
  - otherwise returns fallback mock assets

There is currently no:
- database
- partial-update API
- inquiry submission backend
- admin user system

---

## Cloudinary Behavior

Cloudinary support is present but optional.

Current behavior:
- if Cloudinary credentials are configured, the server calls Cloudinary and returns live assets
- if not, the app still works using fallback mock assets

This is useful because:
- local development does not fully depend on Cloudinary
- the editor UI can still be exercised without live credentials

---

## What Feels Deliberate and Should Be Preserved

These choices appear intentional and worth preserving unless requirements change:

1. Combined deployment model
- Node can serve both the built Angular app and the API

2. Structured content instead of generic CMS blocks
- easier to control breeder-site layout and consistency

3. JSON file persistence
- acceptable for the current scale and ownership model

4. Separate public pages for:
- puppies
- our boys
- our girls
- about us
- contact us
- FAQs

5. Dedicated internal editing route:
- `/brightside-studio`

---

## Likely Next Gaps

These are the things a future thread would likely revisit:
- stronger admin authentication
- contact/inquiry form submission workflow
- save/version history or backup strategy
- more robust production deployment notes
- partial content save APIs if the editor becomes more complex

But those are future enhancements, not proof that the current shape is wrong.

---

## Suggested New-Thread Starting Prompt

If a future thread needs to continue this project, start with something like:

“Read `/Users/mikedowd/brightside-goldens/docs/current_system_state.md`, `/Users/mikedowd/brightside-goldens/docs/business_rules.md`, and `/Users/mikedowd/brightside-goldens/docs/technical_spec.md` first. This project is a JSON-backed Angular + Express content site for Brightside Goldens, with a passphrase-gated internal editor at `/brightside-studio`. Preserve the structured content model unless there is a strong reason to change it.”

---

## Maintenance Rule

When major site behavior changes, update this file with:
- what changed
- whether it was a product decision or technical refactor
- what a future rebuild must preserve
