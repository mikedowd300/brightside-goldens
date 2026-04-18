import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DogCardComponent } from '../dog-card/dog-card.component';
import { FooterLinksComponent } from '../footer-links/footer-links.component';
import { PageContent } from '../../site-content';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [CommonModule, DogCardComponent, FooterLinksComponent],
  templateUrl: './page-layout.component.html',
  styleUrl: './page-layout.component.scss'
})
export class PageLayoutComponent {
  private readonly fallbackImageUrl = '/brightside-image-placeholder.svg';

  @Input({ required: true }) content!: PageContent;

  protected get activeDogs() {
    return this.content.dogs?.filter((dog) => {
      const hasName = !!dog.name?.trim();
      const hasImage = !!dog.images?.some((image) => image.url?.trim());

      return dog.active && hasName && hasImage;
    }) ?? [];
  }

  protected useFallbackImage(event: Event): void {
    const imageElement = event.target as HTMLImageElement | null;

    if (!imageElement || imageElement.src.endsWith(this.fallbackImageUrl)) {
      return;
    }

    imageElement.src = this.fallbackImageUrl;
  }
}
