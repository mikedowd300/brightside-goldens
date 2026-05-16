import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CloudinaryAsset, CloudinaryAssetsResponse, ContentService } from '../../content.service';

@Component({
  selector: 'app-cloudinary-file-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cloudinary-file-selector.component.html',
  styleUrl: './cloudinary-file-selector.component.scss'
})
export class CloudinaryFileSelectorComponent implements OnInit {
  private readonly contentService = inject(ContentService);

  @Input() initialPrefix = '';
  @Output() selected = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();

  protected assets: CloudinaryAsset[] = [];
  protected prefix = '';
  protected isLoading = true;
  protected error = '';
  protected source: CloudinaryAssetsResponse['source'] = 'fallback';

  protected get sourceText(): string {
    return this.source === 'live' ? 'Live Cloudinary files' : 'Fallback sample files';
  }

  ngOnInit(): void {
    this.prefix = this.normalizePrefix(this.initialPrefix);
    this.loadAssets();
  }

  protected loadAssets(): void {
    this.isLoading = true;
    this.error = '';

    this.contentService.getCloudinaryAssets(this.prefix).subscribe({
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

  protected applyPrefix(): void {
    this.prefix = this.normalizePrefix(this.prefix);
    this.loadAssets();
  }

  protected clearPrefix(): void {
    this.prefix = '';
    this.loadAssets();
  }

  private normalizePrefix(value: string): string {
    return value.trim().replace(/^\/+|\/+$/g, '');
  }
}
