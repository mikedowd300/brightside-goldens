import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';

type PuppyHighlight = {
  title: string;
  detail: string;
};

type ContactInfo = {
  email: string;
  phone: string;
  location: string;
};

type SiteData = {
  brand: string;
  tagline: string;
  intro: string;
  announcement: string;
  highlights: PuppyHighlight[];
  contact: ContactInfo;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly http = inject(HttpClient);

  data: SiteData | null = null;
  loading = true;
  error = '';

  ngOnInit(): void {
    this.http.get<SiteData>('/api/site-data').subscribe({
      next: (data) => {
        this.data = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'We could not load Brightside Goldens right now.';
        this.loading = false;
      }
    });
  }
}
