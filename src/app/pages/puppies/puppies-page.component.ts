import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { FooterLinksComponent } from '../../components/footer-links/footer-links.component';
import { LitterShowcaseComponent } from '../../components/litter-showcase/litter-showcase.component';
import { ContentService } from '../../content.service';
import { DogProfile } from '../../site-content';

@Component({
  selector: 'app-puppies-page',
  standalone: true,
  imports: [CommonModule, LitterShowcaseComponent, FooterLinksComponent],
  templateUrl: './puppies-page.component.html',
  styleUrl: './puppies-page.component.scss'
})
export class PuppiesPageComponent {
  protected readonly puppiesContent$ = inject(ContentService)
    .getSiteContent()
    .pipe(
      map((site) => ({
        ...site.puppies,
        litters: site.puppies.litters
          .filter((litter) => litter.status !== 'HOMED')
          .map((litter) => ({
            litter,
            sireDog: this.findDog(site.ourBoys.dogs, litter.sire.dogAnchorId),
            motherDog: this.findDog(site.ourGirls.dogs, litter.mother.dogAnchorId)
          }))
      }))
    );

  private findDog(dogs: DogProfile[] | undefined, anchorId: string): DogProfile | null {
    return dogs?.find((dog) => dog.anchorId === anchorId) ?? null;
  }
}
