import { z } from 'zod';

const imageCardSchema = z
  .object({
    url: z.string(),
    alt: z.string(),
    caption: z.string()
  })
  .strict();

const dogImageSchema = z
  .object({
    url: z.string(),
    alt: z.string()
  })
  .strict();

const dogProfileSchema = z
  .object({
    active: z.boolean(),
    anchorId: z.string().optional(),
    name: z.string(),
    subtitle: z.string(),
    description: z.string(),
    ctaText: z.string().optional(),
    details: z.array(z.string()).optional(),
    images: z.array(dogImageSchema)
  })
  .strict();

const homePageContentSchema = z
  .object({
    highlights: z.array(z.string()),
    slideshowImages: z.array(imageCardSchema)
  })
  .strict();

const faqItemSchema = z
  .object({
    question: z.string(),
    answer: z.array(z.string())
  })
  .strict();

const litterParentSchema = z
  .object({
    name: z.string(),
    image: z.string(),
    dogAnchorId: z.string()
  })
  .strict();

const litterRecordSchema = z
  .object({
    status: z.enum(['PLANNED', 'ON_THE_WAY', 'ARRIVED', 'HOMED']),
    title: z.string(),
    timeframeText: z.string().optional(),
    readyToGoHomeText: z.string().optional(),
    sire: litterParentSchema,
    mother: litterParentSchema,
    puppyImages: z.array(imageCardSchema).optional()
  })
  .strict();

const puppiesPageContentSchema = z
  .object({
    title: z.string(),
    intro: z.string(),
    litters: z.array(litterRecordSchema)
  })
  .strict();

const pageContentSchema = z
  .object({
    title: z.string(),
    intro: z.string(),
    announcement: z.string().optional(),
    paragraphs: z.array(z.string()).optional(),
    highlights: z
      .array(
        z
          .object({
            title: z.string(),
            detail: z.string()
          })
          .strict()
      )
      .optional(),
    images: z.array(imageCardSchema).optional(),
    dogs: z.array(dogProfileSchema).optional()
  })
  .strict();

export const siteContentSchema = z
  .object({
    brand: z.string(),
    home: homePageContentSchema,
    puppies: puppiesPageContentSchema,
    ourBoys: pageContentSchema,
    ourGirls: pageContentSchema,
    aboutUs: pageContentSchema,
    contactUs: pageContentSchema,
    faqs: z
      .object({
        items: z.array(faqItemSchema)
      })
      .strict()
  })
  .strict();
