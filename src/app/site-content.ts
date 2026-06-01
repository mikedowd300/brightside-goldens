export type ImageCard = {
  url: string;
  alt: string;
  caption: string;
};

export type DogImage = {
  url: string;
  alt: string;
};

export type Highlight = {
  title: string;
  detail: string;
};

export type DogProfile = {
  active: boolean;
  anchorId?: string;
  name: string;
  subtitle: string;
  description: string;
  ctaText?: string;
  details?: string[];
  images: DogImage[];
};

export type HomePageContent = {
  title?: string;
  highlights: string[];
  slideshowImages: ImageCard[];
};

export type FaqItem = {
  question: string;
  answer: string[];
};

export type LitterStatus = 'PLANNED' | 'ON_THE_WAY' | 'ARRIVED' | 'HOMED';

export type LitterParent = {
  name: string;
  image: string;
  dogAnchorId: string;
};

export type LitterRecord = {
  status: LitterStatus;
  title: string;
  timeframeText?: string;
  readyToGoHomeText?: string;
  showContactCta?: boolean;
  contactLinkText?: string;
  contactTrailingText?: string;
  sire: LitterParent;
  mother: LitterParent;
  puppyImages?: ImageCard[];
};

export type PuppiesPageContent = {
  title: string;
  intro: string;
  litters: LitterRecord[];
};

export type PageContent = {
  title: string;
  intro: string;
  announcement?: string;
  paragraphs?: string[];
  highlights?: Highlight[];
  images?: ImageCard[];
  dogs?: DogProfile[];
};

export type SiteContent = {
  brand: string;
  tagline?: string;
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
