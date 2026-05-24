import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminImageFieldComponent } from '../admin-image-field/admin-image-field.component';
import { DogImage, DogProfile } from '../../site-content';

@Component({
  selector: 'app-admin-dog-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminImageFieldComponent],
  templateUrl: './admin-dog-editor.component.html',
  styleUrl: './admin-dog-editor.component.scss'
})
export class AdminDogEditorComponent {
  @Input({ required: true }) dog!: DogProfile;
  @Input({ required: true }) index!: number;
  @Input() warning = '';
  @Input() validationError = '';
  @Input() detailIdPrefix = '';
  @Input() imageIdPrefix = '';
  @Input() cloudinaryPrefix = 'brightside-goldens/dogs';
  @Input() expandedImageIndex: number | null = null;
  @Input() expanded = false;
  protected isExpanded = false;
  protected expandedImageIndexes = new Set<number>();

  @Output() changed = new EventEmitter<void>();
  @Output() nameUpdated = new EventEmitter<void>();
  @Output() deleteRequested = new EventEmitter<void>();
  @Output() addDetailRequested = new EventEmitter<void>();
  @Output() removeDetailRequested = new EventEmitter<number>();
  @Output() addImageRequested = new EventEmitter<void>();
  @Output() removeImageRequested = new EventEmitter<number>();

  protected get details(): string[] {
    this.dog.details ??= [];
    return this.dog.details;
  }

  protected get images(): DogImage[] {
    this.dog.images ??= [];
    return this.dog.images;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expanded']?.currentValue) {
      this.isExpanded = true;
    }

    if (typeof changes['expandedImageIndex']?.currentValue === 'number') {
      this.expandedImageIndexes.add(changes['expandedImageIndex'].currentValue);
    }
  }

  protected get canBeActive(): boolean {
    return !!this.dog.name?.trim() && this.images.some((image) => !!image.url?.trim());
  }

  protected trackByIndex(index: number): number {
    return index;
  }

  protected onNameChange(): void {
    if (!this.canBeActive) {
      this.dog.active = false;
    }

    this.nameUpdated.emit();
  }

  protected onImageChange(): void {
    if (!this.canBeActive) {
      this.dog.active = false;
    }

    this.changed.emit();
  }

  protected onActiveChange(isActive: boolean): void {
    this.dog.active = this.canBeActive ? isActive : false;
    this.changed.emit();
  }

  protected toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  protected get panelId(): string {
    return `admin-dog-editor-${this.index}`;
  }

  protected onDeleteClick(event: Event): void {
    event.stopPropagation();
    this.deleteRequested.emit();
  }

  protected toggleImageExpanded(index: number): void {
    if (this.expandedImageIndexes.has(index)) {
      this.expandedImageIndexes.delete(index);
      return;
    }

    this.expandedImageIndexes.add(index);
  }

  protected isImageExpanded(index: number): boolean {
    return this.expandedImageIndexes.has(index);
  }

  protected getImageTitle(image: DogImage, index: number): string {
    const altText = image.alt?.trim();
    return altText ? `Image ${index + 1}: ${altText}` : `Image ${index + 1}`;
  }

  protected getImagePanelId(index: number): string {
    return `${this.panelId}-image-${index}`;
  }

  protected onDeleteImageClick(event: Event, index: number): void {
    event.stopPropagation();
    this.removeImageRequested.emit(index);
  }
}
