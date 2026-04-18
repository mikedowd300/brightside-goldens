import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { FooterLinksComponent } from '../../components/footer-links/footer-links.component';

@Component({
  selector: 'app-contact-us-page',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterLinksComponent],
  templateUrl: './contact-us-page.component.html',
  styleUrl: './contact-us-page.component.scss'
})
export class ContactUsPageComponent {
  private readonly serviceId = 'service_k0un4x3';
  private readonly templateId = 'template_tgpkoog';
  private readonly publicKey = 'Q1pTESXPJIIxAE_XT';

  protected formModel = {
    name: '',
    phone: '',
    email: '',
    message: ''
  };

  protected isSending = false;
  protected successMessage = '';
  protected errorMessage = '';

  protected hasEmailOrPhone(): boolean {
    return !!this.formModel.email.trim() || !!this.formModel.phone.trim();
  }

  protected clearForm(form?: NgForm): void {
    this.formModel = {
      name: '',
      phone: '',
      email: '',
      message: ''
    };
    this.successMessage = '';
    this.errorMessage = '';
    form?.resetForm(this.formModel);
  }

  protected async sendMessage(form: NgForm): Promise<void> {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.isSending) {
      return;
    }

    if (form.invalid || !this.hasEmailOrPhone()) {
      form.control.markAllAsTouched();
      if (!this.hasEmailOrPhone()) {
        this.errorMessage = 'Please provide either an email address or a phone number.';
      }
      return;
    }

    this.isSending = true;

    try {
      await emailjs.send(
        this.serviceId,
        this.templateId,
        {
          name: this.formModel.name,
          phoneNumber: this.formModel.phone,
          email: this.formModel.email,
          message: this.formModel.message
        },
        {
          publicKey: this.publicKey
        }
      );

      this.successMessage = 'Your message has been sent.';
      this.clearForm(form);
    } catch {
      this.errorMessage = 'We could not send your message right now. Please try again.';
    } finally {
      this.isSending = false;
    }
  }
}
