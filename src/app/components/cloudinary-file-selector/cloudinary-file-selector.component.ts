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
  private readonly rootPrefix = 'brightside-goldens';

  @Input() initialPrefix = '';
  @Output() selected = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();

  protected assets: CloudinaryAsset[] = [];
  protected folderPath = '';
  protected isLoading = true;
  protected error = '';
  protected source: CloudinaryAssetsResponse['source'] = 'fallback';
  protected useCloudinaryRoot = false;

  protected get sourceText(): string {
    return this.source === 'live' ? 'Live Cloudinary files' : 'Fallback sample files';
  }

  protected get prefix(): string {
    if (this.useCloudinaryRoot) {
      return '';
    }

    return this.buildPrefix(this.folderPath);
  }

  protected get prefixDescription(): string {
    if (this.useCloudinaryRoot) {
      return 'Cloudinary account root';
    }

    return this.folderPath ? `${this.rootPrefix}/${this.folderPath}` : this.rootPrefix;
  }

  ngOnInit(): void {
    this.folderPath = this.stripRootPrefix(this.normalizePrefix(this.initialPrefix));
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
    this.useCloudinaryRoot = false;
    this.folderPath = this.stripRootPrefix(this.normalizePrefix(this.folderPath));
    this.loadAssets();
  }

  protected clearPrefix(): void {
    this.useCloudinaryRoot = false;
    this.folderPath = '';
    this.loadAssets();
  }

  protected loadCloudinaryRoot(): void {
    this.useCloudinaryRoot = true;
    this.loadAssets();
  }

  private normalizePrefix(value: string): string {
    return value.trim().replace(/^\/+|\/+$/g, '');
  }

  private stripRootPrefix(value: string): string {
    if (!value) {
      return '';
    }

    if (value === this.rootPrefix) {
      return '';
    }

    if (value.startsWith(`${this.rootPrefix}/`)) {
      return value.slice(this.rootPrefix.length + 1);
    }

    return value;
  }

  private buildPrefix(value: string): string {
    const normalizedValue = this.normalizePrefix(value);

    if (!normalizedValue) {
      return this.rootPrefix;
    }

    return `${this.rootPrefix}/${normalizedValue}`;
  }
}
