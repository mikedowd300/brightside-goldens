import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ContentService } from '../../content.service';
import { PageLayoutComponent } from '../../components/page-layout/page-layout.component';

@Component({
  selector: 'app-our-boys-page',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent],
  templateUrl: './our-boys-page.component.html',
  styleUrl: './our-boys-page.component.scss'
})
export class OurBoysPageComponent {
  protected readonly vm$ = inject(ContentService).getSiteContent();
}
