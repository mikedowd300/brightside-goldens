import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FooterLinksComponent } from '../../components/footer-links/footer-links.component';
import { ContentService } from '../../content.service';

@Component({
  selector: 'app-faqs-page',
  standalone: true,
  imports: [CommonModule, FooterLinksComponent],
  templateUrl: './faqs-page.component.html',
  styleUrl: './faqs-page.component.scss'
})
export class FaqsPageComponent {
  protected readonly vm$ = inject(ContentService).getSiteContent();
  protected activeIndex = 0;

  protected toggleAccordion(index: number): void {
    this.activeIndex = this.activeIndex === index ? -1 : index;
  }

  protected isOpen(index: number): boolean {
    return this.activeIndex === index;
  }
}
