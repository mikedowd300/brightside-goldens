# Brightside Goldens Business Rules

## Project Scope

Brightside Goldens is a breeder website, not an account-based software product.

The site exists to:
- present the Brightside Goldens brand
- showcase litters and timing
- introduce the dogs in the program
- explain breeding philosophy and common questions
- give visitors a way to contact the kennel

This project should stay separate from Blackjack Lab in both planning and implementation.

## Primary Audiences

- families looking for a puppy now or in an upcoming litter
- families researching the program before reaching out
- people evaluating sires, dams, and health/testing details
- the site owner using the internal content editor

## Product Direction

The current product direction is a structured content site with a lightweight internal editor.

That means:
- public pages should stay simple, warm, and easy to scan
- content should be managed through structured fields where possible
- the site should not drift into a generic block-based CMS unless requirements change
- editing should be realistic for a single owner/operator, not a multi-user editorial team

## Page Intent

### Home

The homepage should:
- lead with photography
- reinforce trust and tone quickly
- summarize the program through concise highlights

### Puppies

The puppies page is the main availability page.

It should:
- explain current or expected litters
- distinguish between planned, on-the-way, arrived, and homed litters
- connect each litter to sire and mother information
- help a visitor understand whether to inquire now or wait

### Our Boys / Our Girls

These pages should:
- present dogs as profiles, not raw database rows
- support multiple photos per dog
- allow inactive dogs to remain in the data model without appearing prominently on the public site

### About Us

The About page should:
- explain the kennel philosophy and family story
- sound personal and trustworthy
- avoid overly corporate language

### Contact Us

The Contact page should:
- make it easy to send an inquiry
- show the best current contact details
- support questions about litters, timing, and stud service

### FAQs

The FAQ page should:
- answer repeat questions clearly
- stay editable by the owner
- use a simple accordion/list pattern rather than dense long-form copy

## Editorial Rules

Public-facing copy should feel:
- warm
- trustworthy
- direct
- easy to skim

Public-facing copy should avoid:
- CMS/editor terminology
- placeholder text
- obvious test data
- contradictory litter status messaging

## Admin Rules

The internal editor is currently a convenience tool, not a secure admin platform.

Business implications:
- it is acceptable for a single trusted owner workflow
- it should not be treated as a true user-permission system
- content integrity matters more than complex editor features

## Current Known Content Risks

The current repository includes some draft or placeholder content that should be treated as unfinished business rules rather than final copy:
- placeholder dog text in `ourBoys`
- sample or incomplete FAQ answers
- hardcoded contact details in the contact page template
- a hardcoded admin passphrase in frontend code

Those items should be cleaned up before treating the site as production-ready.
