import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CloudinaryAsset, CloudinaryAssetsResponse, ContentService } from '../../content.service';

@Component({
  selector: 'app-cloudinary-file-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cloudinary-file-selector.component.html',
  styleUrl: './cloudinary-file-selector.component.scss'
})
export class CloudinaryFileSelectorComponent implements OnInit {
  private readonly contentService = inject(ContentService);

  @Output() selected = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();

  protected assets: CloudinaryAsset[] = [];
  protected isLoading = true;
  protected error = '';
  protected source: CloudinaryAssetsResponse['source'] = 'fallback';

  protected get sourceText(): string {
    return this.source === 'live' ? 'Live Cloudinary files' : 'Fallback sample files';
  }

  ngOnInit(): void {
    this.contentService.getCloudinaryAssets().subscribe({
      next: (response) => {
        this.assets = response.assets;
        this.source = response.source;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Unable to load Cloudinary files right now.';
        this.isLoading = false;
      }
    });
  }
}
