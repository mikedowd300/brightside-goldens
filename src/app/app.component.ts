import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { hasAdminAccess } from './admin-access';
import { ContentService } from './content.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected readonly siteContent$ = inject(ContentService).getSiteContent();
  private readonly router = inject(Router);

  protected get isAdminRoute(): boolean {
    return this.router.url.startsWith('/brightside-studio');
  }

  protected get showAdminLink(): boolean {
    return hasAdminAccess();
  }
}
