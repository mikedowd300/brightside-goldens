import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminImageFieldComponent } from '../admin-image-field/admin-image-field.component';
import { DogProfile, ImageCard, LitterRecord } from '../../site-content';

@Component({
  selector: 'app-admin-litter-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminImageFieldComponent],
  templateUrl: './admin-litter-editor.component.html',
  styleUrl: './admin-litter-editor.component.scss'
})
export class AdminLitterEditorComponent {
  @Input({ required: true }) litter!: LitterRecord;
  @Input({ required: true }) index!: number;
  @Input({ required: true }) title = '';
  @Input() sireOptions: DogProfile[] = [];
  @Input() motherOptions: DogProfile[] = [];
  @Input() puppyImageIdPrefix = '';
  @Input() expanded = false;

  @Output() changed = new EventEmitter<void>();
  @Output() deleteRequested = new EventEmitter<void>();
  @Output() addPuppyRequested = new EventEmitter<void>();
  @Output() clearPuppyRequested = new EventEmitter<void>();
  @Output() removePuppyRequested = new EventEmitter<number>();

  protected isExpanded = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expanded']?.currentValue) {
      this.isExpanded = true;
    }
  }

  protected trackByIndex(index: number): number {
    return index;
  }

  protected get panelId(): string {
    return `admin-litter-editor-${this.index}`;
  }

  protected toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  protected onDeleteClick(event: Event): void {
    event.stopPropagation();
    this.deleteRequested.emit();
  }

  protected onFieldChange(): void {
    this.changed.emit();
  }

  protected get selectedSire(): DogProfile | null {
    return this.sireOptions.find((dog) => dog.anchorId === this.litter.sire.dogAnchorId) ?? null;
  }

  protected get selectedMother(): DogProfile | null {
    return this.motherOptions.find((dog) => dog.anchorId === this.litter.mother.dogAnchorId) ?? null;
  }

  protected get contactCtaVisible(): boolean {
    return this.litter.showContactCta !== false;
  }

  protected onParentDogChange(role: 'sire' | 'mother', anchorId: string): void {
    const selectedDog =
      (role === 'sire' ? this.sireOptions : this.motherOptions).find((dog) => dog.anchorId === anchorId) ?? null;
    const parent = role === 'sire' ? this.litter.sire : this.litter.mother;

    parent.dogAnchorId = anchorId;
    parent.name = selectedDog?.name ?? '';

    const firstImageUrl = selectedDog?.images?.find((image) => image.url?.trim())?.url ?? '';
    parent.image = firstImageUrl;

    this.onFieldChange();
  }

  protected onParentImageChange(role: 'sire' | 'mother', imageUrl: string): void {
    const parent = role === 'sire' ? this.litter.sire : this.litter.mother;
    parent.image = imageUrl;
    this.onFieldChange();
  }

  protected onContactCtaVisibilityChange(isVisible: boolean): void {
    this.litter.showContactCta = isVisible;
    this.onFieldChange();
  }

  protected getParentImageOptions(role: 'sire' | 'mother') {
    const selectedDog = role === 'sire' ? this.selectedSire : this.selectedMother;
    return selectedDog?.images?.filter((image) => !!image.url?.trim()) ?? [];
  }

  protected get puppyImages(): ImageCard[] {
    this.litter.puppyImages ??= [];
    return this.litter.puppyImages;
  }

  protected get puppySectionTitle(): string {
    return 'Litter Images';
  }

  protected get imageItemLabel(): string {
    return 'Image';
  }
}
