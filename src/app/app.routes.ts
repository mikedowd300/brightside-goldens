import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { PuppiesPageComponent } from './pages/puppies/puppies-page.component';
import { OurBoysPageComponent } from './pages/our-boys/our-boys-page.component';
import { OurGirlsPageComponent } from './pages/our-girls/our-girls-page.component';
import { AdminPageComponent } from './pages/admin/admin-page.component';
import { AboutUsPageComponent } from './pages/about-us/about-us-page.component';
import { ContactUsPageComponent } from './pages/contact-us/contact-us-page.component';
import { FaqsPageComponent } from './pages/faqs/faqs-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'puppies', component: PuppiesPageComponent },
  { path: 'our-boys', component: OurBoysPageComponent },
  { path: 'our-girls', component: OurGirlsPageComponent },
  { path: 'brightside-studio', component: AdminPageComponent },
  { path: 'admin', redirectTo: '' },
  { path: 'about-us', component: AboutUsPageComponent },
  { path: 'contact-us', component: ContactUsPageComponent },
  { path: 'faqs', component: FaqsPageComponent },
  { path: '**', redirectTo: '' }
];
