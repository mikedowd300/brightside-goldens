import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaqItem } from '../../site-content';

@Component({
  selector: 'app-admin-faq-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-faq-editor.component.html',
  styleUrl: './admin-faq-editor.component.scss'
})
export class AdminFaqEditorComponent {
  @Input({ required: true }) faq!: FaqItem;
  @Input({ required: true }) index!: number;
  @Input() answerIdPrefix = '';
  @Input() expanded = false;

  @Output() changed = new EventEmitter<void>();
  @Output() deleteRequested = new EventEmitter<void>();
  @Output() addParagraphRequested = new EventEmitter<void>();
  @Output() removeParagraphRequested = new EventEmitter<number>();

  protected isExpanded = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expanded']?.currentValue) {
      this.isExpanded = true;
    }
  }

  protected get panelId(): string {
    return `admin-faq-editor-${this.index}`;
  }

  protected get title(): string {
    return this.faq.question?.trim() || `FAQ ${this.index + 1}`;
  }

  protected trackByIndex(index: number): number {
    return index;
  }

  protected toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  protected onDeleteClick(event: Event): void {
    event.stopPropagation();
    this.deleteRequested.emit();
  }
}
