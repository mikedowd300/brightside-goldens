import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DogProfile, LitterRecord } from '../../site-content';
import { DogCardComponent } from '../dog-card/dog-card.component';

@Component({
  selector: 'app-litter-showcase',
  standalone: true,
  imports: [CommonModule, RouterLink, DogCardComponent],
  templateUrl: './litter-showcase.component.html',
  styleUrl: './litter-showcase.component.scss'
})
export class LitterShowcaseComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) litter!: LitterRecord;
  @Input() sireDog: DogProfile | null = null;
  @Input() motherDog: DogProfile | null = null;

  protected activeDog: DogProfile | null = null;
  protected activeDogRole = '';
  protected sireImageIndex = 0;
  protected motherImageIndex = 0;
  private slideshowTimer: number | null = null;

  ngOnChanges(_changes: SimpleChanges): void {
    this.sireImageIndex = 0;
    this.motherImageIndex = 0;
    this.syncSlideshows();
  }

  ngOnDestroy(): void {
    this.stopSlideshows();
  }

  protected get sireImageUrl(): string {
    return this.getParentImageUrl(this.sireDog, this.litter.sire.image, this.sireImageIndex);
  }

  protected get sireImageAlt(): string {
    return this.getParentImageAlt(this.sireDog, this.litter.sire.name, this.sireImageIndex);
  }

  protected get motherImageUrl(): string {
    return this.getParentImageUrl(this.motherDog, this.litter.mother.image, this.motherImageIndex);
  }

  protected get motherImageAlt(): string {
    return this.getParentImageAlt(this.motherDog, this.litter.mother.name, this.motherImageIndex);
  }

  protected openDogModal(role: 'Sire' | 'Mother'): void {
    const dog = role === 'Sire' ? this.sireDog : this.motherDog;

    if (!dog) {
      return;
    }

    this.activeDog = dog;
    this.activeDogRole = role;
  }

  protected closeDogModal(): void {
    this.activeDog = null;
    this.activeDogRole = '';
  }

  @HostListener('document:keydown.escape')
  protected handleEscape(): void {
    if (this.activeDog) {
      this.closeDogModal();
    }
  }

  private syncSlideshows(): void {
    this.stopSlideshows();

    const hasSireSlideshow = (this.sireDog?.images?.filter((image) => image.url?.trim()).length ?? 0) > 1;
    const hasMotherSlideshow = (this.motherDog?.images?.filter((image) => image.url?.trim()).length ?? 0) > 1;

    if (!hasSireSlideshow && !hasMotherSlideshow) {
      return;
    }

    this.slideshowTimer = window.setInterval(() => {
      const sireImages = this.sireDog?.images?.filter((image) => image.url?.trim()) ?? [];
      const motherImages = this.motherDog?.images?.filter((image) => image.url?.trim()) ?? [];

      if (sireImages.length > 1) {
        this.sireImageIndex = (this.sireImageIndex + 1) % sireImages.length;
      }

      if (motherImages.length > 1) {
        this.motherImageIndex = (this.motherImageIndex + 1) % motherImages.length;
      }
    }, 5000);
  }

  private stopSlideshows(): void {
    if (!this.slideshowTimer) {
      return;
    }

    window.clearInterval(this.slideshowTimer);
    this.slideshowTimer = null;
  }

  private getParentImageUrl(dog: DogProfile | null, fallbackUrl: string, imageIndex: number): string {
    const images = dog?.images?.filter((image) => image.url?.trim()) ?? [];

    if (!images.length) {
      return fallbackUrl;
    }

    return images[imageIndex]?.url || images[0].url;
  }

  private getParentImageAlt(dog: DogProfile | null, fallbackAlt: string, imageIndex: number): string {
    const images = dog?.images?.filter((image) => image.url?.trim()) ?? [];

    if (!images.length) {
      return fallbackAlt;
    }

    return images[imageIndex]?.alt?.trim() || images[0]?.alt?.trim() || fallbackAlt;
  }
}
