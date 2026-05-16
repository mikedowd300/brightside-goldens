import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CloudinaryFileSelectorComponent } from '../cloudinary-file-selector/cloudinary-file-selector.component';

@Component({
  selector: 'app-admin-image-field',
  standalone: true,
  imports: [CommonModule, FormsModule, CloudinaryFileSelectorComponent],
  templateUrl: './admin-image-field.component.html',
  styleUrl: './admin-image-field.component.scss'
})
export class AdminImageFieldComponent {
  @Input() label = 'Image URL';
  @Input() value = '';
  @Input() invalid = false;
  @Input() cloudinaryPrefix = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() changed = new EventEmitter<void>();

  protected isPickerOpen = false;

  protected onFieldClick(): void {
    this.openPicker();
  }

  protected onFieldKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.openPicker();
  }

  protected openPicker(): void {
    this.isPickerOpen = true;
  }

  protected closePicker(): void {
    this.isPickerOpen = false;
  }

  protected onSelect(url: string): void {
    this.valueChange.emit(url);
    this.changed.emit();
    this.closePicker();
  }
}
