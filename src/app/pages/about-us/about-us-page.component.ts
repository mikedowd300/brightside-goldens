import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FooterLinksComponent } from '../../components/footer-links/footer-links.component';
import { ContentService } from '../../content.service';

@Component({
  selector: 'app-about-us-page',
  standalone: true,
  imports: [CommonModule, FooterLinksComponent],
  templateUrl: './about-us-page.component.html',
  styleUrl: './about-us-page.component.scss'
})
export class AboutUsPageComponent {
  protected readonly vm$ = inject(ContentService).getSiteContent();
}
