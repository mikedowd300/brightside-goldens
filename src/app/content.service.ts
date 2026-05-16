import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SiteContent } from './site-content';
import { getApiUrl } from './runtime-config';

export type CloudinaryAsset = {
  name: string;
  url: string;
  thumbnailUrl: string;
};

export type CloudinaryAssetsResponse = {
  source: 'live' | 'fallback';
  cloudinaryConfigured?: boolean;
  message?: string;
  assets: CloudinaryAsset[];
};

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);

  getSiteContent(): Observable<SiteContent> {
    return this.http.get<SiteContent>(getApiUrl('/api/site-data'));
  }

  updateSiteContent(content: SiteContent): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(getApiUrl('/api/site-data'), content);
  }

  getCloudinaryAssets(prefix = ''): Observable<CloudinaryAssetsResponse> {
    return this.http.get<CloudinaryAssetsResponse>(getApiUrl('/api/cloudinary/assets'), {
      params: { prefix }
    });
  }
}
