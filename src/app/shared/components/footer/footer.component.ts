import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  constructor(public langService: LanguageService) { }

  ngOnInit(): void {
  }

  getTranslation(key: string): string {
    return this.langService.translate(key);
  }

}
