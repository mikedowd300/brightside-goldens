import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DogImage, DogProfile } from '../../site-content';

type DogDetail = {
  key: string;
  separator: string;
  value: string;
};

@Component({
  selector: 'app-dog-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dog-card.component.html',
  styleUrl: './dog-card.component.scss'
})
export class DogCardComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) dog!: DogProfile;
  @Input() ctaText = '';

  protected currentImageIndex = 0;
  private slideshowTimer: number | null = null;

  protected get images(): DogImage[] {
    return this.dog.images?.filter((image) => !!image.url?.trim()) ?? [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dog']) {
      this.currentImageIndex = 0;
      this.syncSlideshow();
    }
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
  }

  protected isActiveImage(index: number): boolean {
    return index === this.currentImageIndex;
  }

  protected parseDetail(detail: string): DogDetail {
    const trimmed = detail.trim();
    const hashIndex = trimmed.indexOf('#');
    const colonIndex = trimmed.indexOf(':');

    let separatorIndex = -1;
    let separator = '';

    if (hashIndex >= 0 && colonIndex >= 0) {
      if (hashIndex < colonIndex) {
        separatorIndex = hashIndex;
        separator = '#';
      } else {
        separatorIndex = colonIndex;
        separator = ':';
      }
    } else if (hashIndex >= 0) {
      separatorIndex = hashIndex;
      separator = '#';
    } else if (colonIndex >= 0) {
      separatorIndex = colonIndex;
      separator = ':';
    }

    if (separatorIndex < 0) {
      return { key: '', separator: '', value: trimmed };
    }

    return {
      key: trimmed.slice(0, separatorIndex).trim(),
      separator,
      value: trimmed.slice(separatorIndex + 1).trim()
    };
  }

  private syncSlideshow(): void {
    this.stopSlideshow();

    if (this.images.length <= 1) {
      return;
    }

    this.slideshowTimer = window.setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }, 5000);
  }

  private stopSlideshow(): void {
    if (!this.slideshowTimer) {
      return;
    }

    window.clearInterval(this.slideshowTimer);
    this.slideshowTimer = null;
  }
}
