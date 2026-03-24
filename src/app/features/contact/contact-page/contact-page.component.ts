import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { ContactService } from '../../../core/services/contact.service';

@Component({
    selector: 'app-contact-page',
    templateUrl: './contact-page.component.html',
    styleUrls: ['./contact-page.component.scss'],
    standalone: false
})
export class ContactPageComponent {
    contactForm: FormGroup;
    submitted = false;
    successMessage = '';

    constructor(private fb: FormBuilder, public langService: LanguageService, private contactService: ContactService) {
        this.contactForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            subject: ['', Validators.required],
            message: ['', Validators.required]
        });
    }

    onSubmit() {
        this.submitted = true;
        if (this.contactForm.valid) {
            this.contactService.addMessage(this.contactForm.value).subscribe(() => {
                this.successMessage = this.langService.translate('contact.successMsg');
                this.contactForm.reset();
                this.submitted = false;
            });
        }
    }
}
