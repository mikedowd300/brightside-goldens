import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminImageFieldComponent } from '../admin-image-field/admin-image-field.component';
import { ImageCard } from '../../site-content';

@Component({
  selector: 'app-admin-slide-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminImageFieldComponent],
  templateUrl: './admin-slide-editor.component.html',
  styleUrl: './admin-slide-editor.component.scss'
})
export class AdminSlideEditorComponent {
  @Input({ required: true }) slide!: ImageCard;
  @Input({ required: true }) index!: number;
  @Input() canDelete = true;
  @Input() expanded = false;

  @Output() changed = new EventEmitter<void>();
  @Output() deleteRequested = new EventEmitter<void>();

  protected isExpanded = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expanded']?.currentValue) {
      this.isExpanded = true;
    }
  }

  protected get panelId(): string {
    return `admin-slide-editor-${this.index}`;
  }

  protected get title(): string {
    const altText = this.slide.alt?.trim();

    if (altText) {
      return `Slide ${this.index + 1}: ${altText}`;
    }

    return `Slide ${this.index + 1}`;
  }

  protected toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  protected onDeleteClick(event: Event): void {
    event.stopPropagation();
    this.deleteRequested.emit();
  }
}
