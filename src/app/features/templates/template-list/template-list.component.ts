import { Component, OnInit } from '@angular/core';
import { AuthMockService } from '../../../core/services/auth-mock.service';
import { User } from '../../../core/models/user.model';
import { LanguageService } from '../../../core/services/language.service';
import { TemplateService } from '../../../core/services/template.service';
import { Template } from '../../../core/models/template.model';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent implements OnInit {
  templates: Template[] = [];
  currentUser: User | null = null;

  constructor(
    private templateService: TemplateService, 
    private authService: AuthMockService,
    public langService: LanguageService
  ) { }

  ngOnInit(): void {
    this.templateService.getVisibleTemplates().subscribe(templates => {
      this.templates = templates;
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  onAddTemplate(): void {
    const titlePrompt = this.langService.translate('templates.prompts.newTitle');
    const descPrompt = this.langService.translate('templates.prompts.newDesc');
    
    const title = prompt(titlePrompt);
    const description = prompt(descPrompt);
    if (title && description) {
      this.templateService.addTemplate({
        id: 0,
        title,
        description,
        lastUpdate: new Date().toLocaleDateString('en-GB'),
        fileSize: '1.2 MB',
        fileUrl: '#',
        isVisible: true,
        order: 0
      }).subscribe(() => {
        this.templateService.getTemplates().subscribe(templates => this.templates = templates);
      });
    }
  }
}
