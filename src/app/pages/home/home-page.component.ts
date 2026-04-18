import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { map } from 'rxjs';
import { ContentService } from '../../content.service';
import { FooterLinksComponent } from '../../components/footer-links/footer-links.component';
import { HomePageContent } from '../../site-content';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FooterLinksComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit, OnDestroy {
  private readonly contentService = inject(ContentService);
  private slideshowTimer: ReturnType<typeof setInterval> | null = null;

  protected readonly homeContent$ = this.contentService
    .getSiteContent()
    .pipe(map((site) => site.home));

  protected currentSlideIndex = 0;

  ngOnInit(): void {
    this.slideshowTimer = setInterval(() => {
      this.currentSlideIndex += 1;
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.slideshowTimer) {
      clearInterval(this.slideshowTimer);
    }
  }

  protected getSlideOpacity(index: number, content: HomePageContent): number {
    const totalSlides = content.slideshowImages.length;
    return totalSlides && index === this.currentSlideIndex % totalSlides ? 1 : 0;
  }
}
