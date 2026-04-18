import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ContentService } from '../../content.service';
import { PageLayoutComponent } from '../../components/page-layout/page-layout.component';

@Component({
  selector: 'app-our-girls-page',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent],
  templateUrl: './our-girls-page.component.html',
  styleUrl: './our-girls-page.component.scss'
})
export class OurGirlsPageComponent {
  protected readonly vm$ = inject(ContentService).getSiteContent();
}
