# Brightside Goldens – Business Rules & Product Direction

## Core Purpose

Brightside Goldens is a content-driven breeder website.

Its job is to:
- present the Brightside Goldens brand clearly
- show current and planned litters
- introduce the dogs in the program
- answer common questions
- give visitors a clear way to reach out

This is not a user-account product like Blackjack Lab. The site is much closer to a brochure, catalog, and inquiry website with a lightweight internal content editor.

---

## Audience

Primary audiences:
- families interested in a puppy
- people researching future litters and timing
- people evaluating the breeding program
- breeders or owners interested in stud services

Secondary audience:
- the site owner/editor maintaining content through the admin studio

---

## Content Strategy

The site is currently driven by a single structured site-content object rather than a database-backed CMS.

Current content model includes:
- brand name
- homepage slideshow and highlights
- puppies page intro and litter records
- our boys page content and dog profiles
- our girls page content and dog profiles
- about us page content
- contact us page content
- FAQs

Current product direction:
- keep content editing highly structured
- prefer predictable fields over free-form layout building
- allow the owner to update real site content without editing code
- keep the live site readable, warm, and simple

---

## Page Intent

### Home

The homepage should:
- establish the Brightside Goldens brand
- introduce the overall program quickly
- showcase photography prominently
- highlight a few key values or selling points

### Puppies

The puppies page should:
- act as the main litter-availability page
- distinguish between planned, on-the-way, arrived, and homed litters
- help visitors understand timing and next steps
- connect each litter to the sire and mother

Current litter statuses:
- `PLANNED`
- `ON_THE_WAY`
- `ARRIVED`
- `HOMED`

Current display direction:
- `HOMED` litters should not be treated like available/current litters
- planned and on-the-way litters may show puppy photos from previous litters for the same pairing
- arrived litters may show current puppy images and selection/visit guidance

### Our Boys / Our Girls

These pages should:
- introduce the dogs in the program
- present them as profiles, not raw records
- support multiple images per dog
- allow inactive dogs to remain in content history without dominating the live presentation

### About Us

The About Us page should:
- communicate the philosophy and personality of the program
- use structured editorial content
- feel warm and trustworthy rather than overly corporate

### Contact Us

The Contact Us page should:
- make it easy for visitors to initiate contact
- clearly show the primary email address
- invite inquiry about litters, timing, and next steps

Current direction:
- this is a contact/info page, not a fully implemented lead-management workflow

### FAQs

The FAQs page should:
- answer common buyer questions
- use a simple accordion/list presentation
- be fully editable from the internal admin studio

---

## Admin Studio Direction

The internal admin area is currently called:
- `Brightside Goldens Site Content Editor`

Current route:
- `/brightside-studio`

Current access model:
- access is protected by a passphrase gate in the frontend
- this is a lightweight internal editor, not a multi-user role-based admin system

Current editor modes:
- structured editor
- raw JSON editor

Current product direction:
- structured editing should be the primary mode
- raw JSON should remain available as an escape hatch for advanced edits

Current editable areas:
- home
- puppies
- our boys
- our girls
- about us
- contact us
- FAQs

Current editing expectations:
- content changes should feel direct and visual
- array-based content should support add/delete workflows
- editing should preserve the overall content schema

---

## Image Strategy

Images are central to the site experience.

Current product direction:
- home uses slideshow imagery
- dog profiles support multiple images
- litters support puppy-image strips/galleries
- editors should be able to choose from Cloudinary-backed assets when available

Current fallback direction:
- the app can fall back to mock Cloudinary assets when live Cloudinary credentials are not configured

---

## FAQ Strategy

Current FAQ shape direction:
- `question`
- `answer` as an array of paragraphs/strings

Current behavior direction:
- FAQs are site-owned content, not user-generated content
- they should be editable in the admin studio
- they do not need per-page scoping in the current site model

---

## Editorial Rules

The live site should feel:
- warm
- clear
- trustworthy
- easy to scan

Content should avoid:
- overly technical wording
- cluttered CTAs
- admin/CMS jargon leaking into the public site

---

## Anti-Patterns

Do NOT:
- turn the site into an overbuilt CMS unless the business truly needs it
- require database-backed content management if the JSON-backed model remains sufficient
- expose internal admin/editor tooling publicly
- let structured content drift into inconsistent shapes that break rendering
