import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactRoutingModule } from './contact-routing.module';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { SharedModule } from '../../shared/shared.module';
import { HeroBannerComponent } from '../../shared/components/hero-banner/hero-banner.component';

@NgModule({
    declarations: [
        ContactPageComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ContactRoutingModule,
        SharedModule,
        HeroBannerComponent
    ]
})
export class ContactModule { }
