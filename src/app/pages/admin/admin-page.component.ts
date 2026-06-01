import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminDogEditorComponent } from '../../components/admin-dog-editor/admin-dog-editor.component';
import { AdminFaqEditorComponent } from '../../components/admin-faq-editor/admin-faq-editor.component';
import { AdminLitterEditorComponent } from '../../components/admin-litter-editor/admin-litter-editor.component';
import { AdminSlideEditorComponent } from '../../components/admin-slide-editor/admin-slide-editor.component';
import { grantAdminAccess, hasAdminAccess, isValidAdminPassphrase } from '../../admin-access';
import { ContentService } from '../../content.service';
import { siteContentSchema } from '../../site-content.schema';
import {
  DogImage,
  DogProfile,
  FaqItem,
  ImageCard,
  LitterParent,
  LitterRecord,
  PageContent,
  SiteContent
} from '../../site-content';

type AdminMode = 'form' | 'json';
type AdminTab =
  | 'home'
  | 'puppies'
  | 'ourBoys'
  | 'ourGirls'
  | 'admin'
  | 'aboutUs'
  | 'contactUs'
  | 'faqs';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminDogEditorComponent, AdminFaqEditorComponent, AdminLitterEditorComponent, AdminSlideEditorComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss'
})
export class AdminPageComponent {
  private readonly contentService = inject(ContentService);
  private readonly router = inject(Router);
  private readonly floatingSaveTabs: AdminTab[] = ['home', 'puppies', 'ourBoys', 'ourGirls', 'aboutUs'];
  private savedHomeSnapshot: { brand: string; tagline?: string; home: SiteContent['home'] } | null = null;
  private savedPuppiesSnapshot: SiteContent['puppies'] | null = null;
  private savedOurBoysSnapshot: SiteContent['ourBoys'] | null = null;
  private savedOurGirlsSnapshot: SiteContent['ourGirls'] | null = null;
  private savedAboutUsSnapshot: SiteContent['aboutUs'] | null = null;

  protected readonly primaryTabs: Array<{ id: AdminTab; label: string }> = [
    { id: 'home', label: 'Home' },
    { id: 'puppies', label: 'Puppies' },
    { id: 'ourBoys', label: 'Our Boys' },
    { id: 'ourGirls', label: 'Our Girls' }
  ];
  protected readonly secondaryTabs: Array<{ id: AdminTab; label: string }> = [
    { id: 'aboutUs', label: 'About Us' },
    { id: 'contactUs', label: 'Contact Us' },
    { id: 'faqs', label: 'FAQs' }
  ];
  protected readonly allTabs: Array<{ id: AdminTab; label: string }> = [
    ...this.primaryTabs,
    ...this.secondaryTabs
  ];

  protected hasAdminAccess = hasAdminAccess();
  protected adminPassphrase = '';
  protected adminAccessError = '';
  protected mode: AdminMode = 'form';
  protected activeTab: AdminTab = 'home';
  protected content: SiteContent | null = null;
  protected jsonText = '';
  protected message = '';
  protected error = '';
  protected isSaving = false;
  protected isDirty = false;
  protected floatingTabHasUnsavedChanges = false;
  protected floatingTabStatusMessage = '';
  protected floatingTabStatusError = '';
  protected expandedNewSlideIndex: number | null = null;
  protected expandedNewLitterIndex: number | null = null;
  protected expandedNewDogIndex: number | null = null;
  protected expandedNewFaqIndex: number | null = null;
  protected expandedNewDogImageKey = '';
  protected expandedNewDogImageIndex: number | null = null;
  protected jsonErrorFrame: Array<{ lineNumber: number; text: string; isProblemLine: boolean }> = [];
  protected jsonErrorColumn: number | null = null;
  protected dogDeleteWarnings: Record<string, string> = {};
  protected dogValidationErrors: Record<string, string> = {};

  constructor() {
    if (this.hasAdminAccess) {
      this.loadContent();
    }
  }

  protected submitAdminPassphrase(): void {
    this.adminAccessError = '';

    if (!isValidAdminPassphrase(this.adminPassphrase)) {
      this.router.navigateByUrl('/');
      return;
    }

    grantAdminAccess();
    this.hasAdminAccess = true;
    this.adminPassphrase = '';

    if (!this.content) {
      this.loadContent();
    }
  }

  private get isStructuredFloatingTabActive(): boolean {
    return this.mode === 'form' && this.usesFloatingSaveBar(this.activeTab);
  }

  protected setMode(mode: AdminMode): void {
    if (mode === this.mode) {
      return;
    }

    if (mode === 'json' && this.content) {
      this.syncJsonFromContent();
    }

    if (mode === 'form' && !this.hydrateContentFromJson()) {
      return;
    }

    this.mode = mode;
    this.message = '';

    if (mode === 'form') {
      this.floatingTabHasUnsavedChanges = false;
      this.floatingTabStatusMessage = '';
      this.floatingTabStatusError = '';
    }
  }

  protected setActiveTab(tab: AdminTab): void {
    if (this.usesFloatingSaveBar(this.activeTab) && tab !== this.activeTab) {
      this.resetFloatingTabEditingState(this.activeTab);
    }

    this.activeTab = tab;
  }

  protected get showFloatingSaveBar(): boolean {
    return (
      this.mode === 'form' &&
      this.usesFloatingSaveBar(this.activeTab) &&
      (this.floatingTabHasUnsavedChanges || this.isSaving || !!this.floatingTabStatusMessage || !!this.floatingTabStatusError)
    );
  }

  protected get floatingSaveText(): string {
    if (this.isSaving) {
      return 'Saving...';
    }

    if (this.floatingTabStatusError) {
      return this.floatingTabStatusError;
    }

    if (this.floatingTabStatusMessage) {
      return this.floatingTabStatusMessage;
    }

    if (this.floatingTabHasUnsavedChanges) {
      return 'Unsaved changes';
    }

    return 'Saved';
  }

  protected get floatingSaveTone(): 'saving' | 'error' | 'dirty' | 'saved' {
    if (this.isSaving) {
      return 'saving';
    }

    if (this.floatingTabStatusError) {
      return 'error';
    }

    if (this.floatingTabStatusMessage) {
      return 'saved';
    }

    if (this.floatingTabHasUnsavedChanges) {
      return 'dirty';
    }

    return 'saved';
  }

  protected trackByIndex(index: number): number {
    return index;
  }

  protected getLitterEditorTitle(litter: LitterRecord, index: number): string {
    const motherName = litter.mother.name?.trim();
    const sireName = litter.sire.name?.trim();

    if (motherName && sireName) {
      return `${motherName} and ${sireName}`;
    }

    return `Litter ${index + 1}`;
  }

  private loadContent(): void {
    this.message = '';
    this.error = '';

    this.contentService.getSiteContent().subscribe({
      next: (content) => {
        this.content = this.clone(content);
        this.savedHomeSnapshot = { brand: content.brand, tagline: content.tagline, home: this.clone(content.home) };
        this.savedPuppiesSnapshot = this.clone(content.puppies);
        this.savedOurBoysSnapshot = this.clone(content.ourBoys);
        this.savedOurGirlsSnapshot = this.clone(content.ourGirls);
        this.savedAboutUsSnapshot = this.clone(content.aboutUs);
        this.syncJsonFromContent();
        this.isDirty = false;
        this.floatingTabHasUnsavedChanges = false;
        this.floatingTabStatusMessage = '';
        this.floatingTabStatusError = '';
      },
      error: () => {
        this.error = 'Unable to load site content.';
      }
    });
  }

  protected save(): void {
    this.message = '';
    this.error = '';
    this.floatingTabStatusMessage = '';
    this.floatingTabStatusError = '';

    if (this.mode === 'json' && !this.hydrateContentFromJson()) {
      return;
    }

    if (this.mode !== 'json') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (!this.content) {
      this.error = 'Unable to save site content.';
      if (this.isStructuredFloatingTabActive) {
        this.floatingTabStatusError = this.error;
      }
      return;
    }

    if (!this.validateDogsBeforeSave()) {
      this.error = 'Complete every dog name and image URL before saving.';
      if (this.isStructuredFloatingTabActive) {
        this.floatingTabStatusError = this.error;
      }
      return;
    }

    this.isSaving = true;

    this.contentService.updateSiteContent(this.content).subscribe({
      next: (response) => {
        this.message = response.message;
        if (this.isStructuredFloatingTabActive) {
          this.floatingTabStatusMessage = response.message;
          this.updateSavedSnapshotForTab(this.activeTab);
          this.floatingTabHasUnsavedChanges = false;
        }
        this.syncJsonFromContent();
        this.isSaving = false;
        this.isDirty = false;
      },
      error: () => {
        this.error = 'Unable to save site content.';
        if (this.isStructuredFloatingTabActive) {
          this.floatingTabStatusError = this.error;
        }
        this.isSaving = false;
      }
    });
  }

  protected undoJsonChanges(): void {
    this.syncJsonFromContent();
    this.error = '';
    this.message = '';
    this.jsonErrorFrame = [];
    this.jsonErrorColumn = null;
    this.isDirty = false;
  }

  protected addHomeHighlight(items: string[], scrollPrefix?: string): void {
    items.push('');
    this.afterStructuredChange();
    this.scrollToNewArrayItem(scrollPrefix, items.length - 1);
  }

  protected addImage(items: ImageCard[], scrollPrefix?: string): void {
    items.push(this.createImageCard());
    if (scrollPrefix === 'home-slide') {
      this.expandedNewSlideIndex = items.length - 1;
    }
    this.afterStructuredChange();
    this.scrollToNewArrayItem(scrollPrefix, items.length - 1);
  }

  protected addParagraph(items: string[], scrollPrefix?: string): void {
    items.push('');
    this.afterStructuredChange();
    this.scrollToNewArrayItem(scrollPrefix, items.length - 1);
  }

  protected addDetail(items: string[], scrollPrefix?: string): void {
    items.push('');
    this.afterStructuredChange();
    this.scrollToNewArrayItem(scrollPrefix, items.length - 1);
  }

  protected addFaq(items: FaqItem[], scrollPrefix?: string): void {
    items.push(this.createFaqItem());
    this.expandedNewFaqIndex = items.length - 1;
    this.afterStructuredChange();
    this.scrollToNewArrayItem(scrollPrefix, items.length - 1);
  }

  protected addDog(items: DogProfile[], scrollPrefix?: string): void {
    items.push(this.createDogProfile());
    this.expandedNewDogIndex = items.length - 1;
    this.afterStructuredChange();
    this.scrollToNewArrayItem(scrollPrefix, items.length - 1);
  }

  protected addDogImage(dog: DogProfile, dogIndex: number, scrollPrefix?: string): void {
    dog.images ??= [];
    dog.images.push(this.createDogImage());
    this.expandedNewDogImageKey = `${this.activeTab}:${dogIndex}`;
    this.expandedNewDogImageIndex = dog.images.length - 1;
    this.afterStructuredChange();
    this.scrollToNewArrayItem(scrollPrefix, dog.images.length - 1);
  }

  protected addLitter(items: LitterRecord[], scrollPrefix?: string): void {
    items.push(this.createLitterRecord());
    this.expandedNewLitterIndex = items.length - 1;
    this.afterStructuredChange();
    this.scrollToNewArrayItem(scrollPrefix, items.length - 1);
  }

  protected addPuppyImages(litter: LitterRecord, scrollPrefix?: string): void {
    litter.puppyImages ??= [];
    litter.puppyImages.push(this.createImageCard());
    this.afterStructuredChange();
    this.scrollToNewArrayItem(scrollPrefix, litter.puppyImages.length - 1);
  }

  protected removeArrayItem<T>(items: T[], index: number): void {
    items.splice(index, 1);
    this.afterStructuredChange();
  }

  protected attemptRemoveDog(index: number): void {
    if (!this.content) {
      return;
    }

    const dogs = this.ensureDogs(this.selectedDogPage);
    const dog = dogs[index];

    if (!dog) {
      return;
    }

    const warningKey = this.getDogWarningKey(index);
    const matchingLitters = this.content.puppies.litters
      .filter((litter) => {
        const matchingAnchorId =
          this.activeTab === 'ourGirls' ? litter.mother.dogAnchorId : litter.sire.dogAnchorId;

        return !!dog.anchorId && matchingAnchorId === dog.anchorId;
      })
      .map((litter) => litter.title);

    if (matchingLitters.length) {
      const littersLabel = matchingLitters.length === 1 ? 'litter' : 'litters';
      this.dogDeleteWarnings[warningKey] =
        `This dog is still being used by one or more ${littersLabel} and cannot be deleted. ` +
        `If you want to keep those ${littersLabel}, set this dog to inactive instead. ` +
        `Update these ${littersLabel} first if you still want to delete it: ${matchingLitters.join(', ')}`;
      return;
    }

    delete this.dogDeleteWarnings[warningKey];
    dogs.splice(index, 1);
    this.afterStructuredChange();
  }

  protected clearOptionalImages(litter: LitterRecord, key: 'puppyImages'): void {
    litter[key] = [];
    this.afterStructuredChange();
  }

  protected onStructuredChange(): void {
    this.afterStructuredChange();
  }

  protected updateDogAnchorIdFromName(parent: LitterParent): void {
    parent.dogAnchorId = this.slugify(parent.name);
    this.afterStructuredChange();
  }

  protected updateAnchorIdFromDogName(dog: DogProfile): void {
    dog.anchorId = this.slugify(dog.name);
    this.afterStructuredChange();
  }

  protected ensureDetails(dog: DogProfile): string[] {
    dog.details ??= [];
    return dog.details;
  }

  protected ensureDogs(page: PageContent): DogProfile[] {
    page.dogs ??= [];
    return page.dogs;
  }

  protected get selectedDogPage(): PageContent {
    return this.activeTab === 'ourGirls' ? this.content!.ourGirls : this.content!.ourBoys;
  }

  protected isTabActive(tab: AdminTab): boolean {
    return this.activeTab === tab;
  }

  protected getDogDeleteWarning(index: number): string {
    return this.dogDeleteWarnings[this.getDogWarningKey(index)] ?? '';
  }

  protected getDogValidationError(index: number): string {
    return this.dogValidationErrors[this.getDogWarningKey(index)] ?? '';
  }

  private afterStructuredChange(): void {
    this.message = '';
    this.error = '';
    this.isDirty = true;
    if (this.usesFloatingSaveBar(this.activeTab)) {
      this.floatingTabHasUnsavedChanges = true;
      this.floatingTabStatusMessage = '';
      this.floatingTabStatusError = '';
    }
    this.dogDeleteWarnings = {};
    this.dogValidationErrors = {};
    this.normalizeDogActivity();
    if (this.mode === 'json') {
      this.syncJsonFromContent();
    }
  }

  private getDogWarningKey(index: number): string {
    return `${this.activeTab}:${index}`;
  }

  private scrollToNewArrayItem(prefix: string | undefined, index: number): void {
    if (!prefix) {
      return;
    }

    window.setTimeout(() => {
      const target = document.getElementById(`${prefix}-${index}`);

      if (!target) {
        return;
      }

      const top = window.scrollY + target.getBoundingClientRect().top - 24;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }, 40);

    window.setTimeout(() => {
      this.clearExpandedNewItemState();
    }, 320);
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/['"]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private hydrateContentFromJson(): boolean {
    const validation = this.parseAndValidateJsonText();

    if (!validation.isValid || !validation.content) {
      this.error = validation.message;
      return false;
    }

    this.content = this.clone(validation.content);
    this.error = '';
    this.isDirty = true;
    return true;
  }

  private parseAndValidateJsonText():
    | { isValid: true; content: SiteContent; message: '' }
    | { isValid: false; content: null; message: string } {
    let parsed: unknown;

    try {
      parsed = JSON.parse(this.jsonText);
    } catch (error) {
      const parseMessage = error instanceof Error ? error.message : 'Unknown JSON parsing error.';
      const location = this.extractJsonErrorLocation(parseMessage);

      if (location) {
        this.jsonErrorFrame = this.buildJsonErrorFrame(location.line);
        this.jsonErrorColumn = location.column;
      } else {
        this.jsonErrorFrame = [];
        this.jsonErrorColumn = null;
      }

      return {
        isValid: false,
        content: null,
        message: `The JSON is not valid. ${parseMessage}`
      };
    }

    const issues = this.validateSiteContentShape(parsed);

    if (issues.length) {
      this.jsonErrorFrame = [];
      this.jsonErrorColumn = null;
      return {
        isValid: false,
        content: null,
        message: `Validation failed: ${issues[0]}`
      };
    }

    this.jsonErrorFrame = [];
    this.jsonErrorColumn = null;
    return {
      isValid: true,
      content: parsed as SiteContent,
      message: ''
    };
  }

  private extractJsonErrorLocation(message: string): { line: number; column: number } | null {
    const match = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);

    if (!match) {
      return null;
    }

    return {
      line: Number(match[1]),
      column: Number(match[2])
    };
  }

  private buildJsonErrorFrame(problemLine: number): Array<{ lineNumber: number; text: string; isProblemLine: boolean }> {
    const lines = this.jsonText.split('\n');
    const startLine = Math.max(1, problemLine - 1);
    const endLine = Math.min(lines.length, problemLine + 1);
    const frame: Array<{ lineNumber: number; text: string; isProblemLine: boolean }> = [];

    for (let lineNumber = startLine; lineNumber <= endLine; lineNumber += 1) {
      frame.push({
        lineNumber,
        text: lines[lineNumber - 1] ?? '',
        isProblemLine: lineNumber === problemLine
      });
    }

    return frame;
  }

  private validateSiteContentShape(value: unknown): string[] {
    const result = siteContentSchema.safeParse(value);

    if (result.success) {
      return [];
    }

    return result.error.issues.map((issue) => {
      const path = issue.path.length ? issue.path.join('.') : 'root';
      return `"${path}": ${issue.message}`;
    });
  }

  private syncJsonFromContent(): void {
    if (!this.content) {
      this.jsonText = '';
      return;
    }

    this.jsonText = JSON.stringify(this.content, null, 2);
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }

  private createImageCard(): ImageCard {
    return {
      url: '',
      alt: '',
      caption: ''
    };
  }

  private createDogProfile(): DogProfile {
    return {
      active: true,
      anchorId: '',
      name: '',
      subtitle: '',
      description: '',
      ctaText: '',
      details: [''],
      images: [this.createDogImage()]
    };
  }

  private createDogImage(): DogImage {
    return {
      url: '',
      alt: ''
    };
  }

  private createLitterParent(): LitterParent {
    return {
      name: '',
      image: '',
      dogAnchorId: ''
    };
  }

  private createLitterRecord(): LitterRecord {
    return {
      status: 'PLANNED',
      title: '',
      timeframeText: '',
      readyToGoHomeText: '',
      showContactCta: true,
      contactLinkText: 'Contact us',
      contactTrailingText: 'to set up an appointment to select a puppy.',
      sire: this.createLitterParent(),
      mother: this.createLitterParent(),
      puppyImages: []
    };
  }

  private createFaqItem(): FaqItem {
    return {
      question: '',
      answer: ['']
    };
  }

  private normalizeDogActivity(): void {
    if (!this.content) {
      return;
    }

    for (const page of [this.content.ourBoys, this.content.ourGirls]) {
      for (const dog of page.dogs ?? []) {
        if (!this.dogHasRequiredFields(dog)) {
          dog.active = false;
        }
      }
    }
  }

  private validateDogsBeforeSave(): boolean {
    if (!this.content) {
      return true;
    }

    const nextErrors: Record<string, string> = {};
    let firstInvalidTab: AdminTab | null = null;

    const collectErrors = (dogs: DogProfile[] | undefined, tab: AdminTab): void => {
      for (const [index, dog] of (dogs ?? []).entries()) {
        if (this.dogHasRequiredFields(dog)) {
          continue;
        }

        nextErrors[`${tab}:${index}`] = 'This dog needs both a Name and an Image URL before you can save.';
        firstInvalidTab ??= tab;
      }
    };

    collectErrors(this.content.ourBoys.dogs, 'ourBoys');
    collectErrors(this.content.ourGirls.dogs, 'ourGirls');

    this.dogValidationErrors = nextErrors;

    if (firstInvalidTab) {
      this.activeTab = firstInvalidTab;
      return false;
    }

    return true;
  }

  private dogHasRequiredFields(dog: DogProfile): boolean {
    return !!dog.name?.trim() && !!dog.images?.some((image) => !!image.url?.trim());
  }

  private resetFloatingTabEditingState(tab: AdminTab): void {
    if (!this.content) {
      return;
    }

    if (tab === 'home' && this.savedHomeSnapshot) {
      this.content.brand = this.savedHomeSnapshot.brand;
      this.content.tagline = this.savedHomeSnapshot.tagline;
      this.content.home = this.clone(this.savedHomeSnapshot.home);
    } else if (tab === 'puppies' && this.savedPuppiesSnapshot) {
      this.content.puppies = this.clone(this.savedPuppiesSnapshot);
    } else if (tab === 'ourBoys' && this.savedOurBoysSnapshot) {
      this.content.ourBoys = this.clone(this.savedOurBoysSnapshot);
    } else if (tab === 'ourGirls' && this.savedOurGirlsSnapshot) {
      this.content.ourGirls = this.clone(this.savedOurGirlsSnapshot);
    } else if (tab === 'aboutUs' && this.savedAboutUsSnapshot) {
      this.content.aboutUs = this.clone(this.savedAboutUsSnapshot);
    }

    this.floatingTabHasUnsavedChanges = false;
    this.floatingTabStatusMessage = '';
    this.floatingTabStatusError = '';
    this.message = '';
    this.error = '';
    this.isDirty = false;
    this.clearExpandedNewItemState();

    if (this.mode === 'json') {
      this.syncJsonFromContent();
    }
  }

  private updateSavedSnapshotForTab(tab: AdminTab): void {
    if (!this.content) {
      return;
    }

    if (tab === 'home') {
      this.savedHomeSnapshot = {
        brand: this.content.brand,
        tagline: this.content.tagline,
        home: this.clone(this.content.home)
      };
    } else if (tab === 'puppies') {
      this.savedPuppiesSnapshot = this.clone(this.content.puppies);
    } else if (tab === 'ourBoys') {
      this.savedOurBoysSnapshot = this.clone(this.content.ourBoys);
    } else if (tab === 'ourGirls') {
      this.savedOurGirlsSnapshot = this.clone(this.content.ourGirls);
    } else if (tab === 'aboutUs') {
      this.savedAboutUsSnapshot = this.clone(this.content.aboutUs);
    }
  }

  protected usesFloatingSaveBar(tab: AdminTab): boolean {
    return this.floatingSaveTabs.includes(tab);
  }

  protected isNewSlideExpanded(index: number): boolean {
    return this.expandedNewSlideIndex === index;
  }

  protected isNewLitterExpanded(index: number): boolean {
    return this.expandedNewLitterIndex === index;
  }

  protected isNewDogExpanded(index: number): boolean {
    return this.expandedNewDogIndex === index;
  }

  protected isNewFaqExpanded(index: number): boolean {
    return this.expandedNewFaqIndex === index;
  }

  private clearExpandedNewItemState(): void {
    this.expandedNewSlideIndex = null;
    this.expandedNewLitterIndex = null;
    this.expandedNewDogIndex = null;
    this.expandedNewFaqIndex = null;
    this.expandedNewDogImageKey = '';
    this.expandedNewDogImageIndex = null;
  }

  protected getExpandedNewDogImageIndex(dogIndex: number): number | null {
    if (this.expandedNewDogImageKey !== `${this.activeTab}:${dogIndex}`) {
      return null;
    }

    return this.expandedNewDogImageIndex;
  }
}
