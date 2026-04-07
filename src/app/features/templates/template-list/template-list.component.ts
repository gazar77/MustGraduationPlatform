import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { LanguageService } from '../../../core/services/language.service';
import { TemplateService } from '../../../core/services/template.service';
import { Template } from '../../../core/models/template.model';
import { fileUrlToAbsolute } from '../../../core/utils/api-url.util';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent implements OnInit {
  templates: Template[] = [];
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private templateService: TemplateService,
    public langService: LanguageService
  ) { }

  absFileUrl(url: string): string {
    return fileUrlToAbsolute(url);
  }

  canDownload(template: Template): boolean {
    const u = template.fileUrl?.trim();
    return !!u && u !== '#';
  }

  downloadTemplate(template: Template): void {
    if (!this.canDownload(template)) return;
    this.templateService.downloadTemplateFile(template.id).subscribe({
      next: (blob) => {
        const ext = this.extensionFromPath(template.fileUrl);
        const base = this.safeFileBaseName(template.title);
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = `${base}${ext}`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => {
        window.open(this.absFileUrl(template.fileUrl), '_blank', 'noopener,noreferrer');
      }
    });
  }

  private extensionFromPath(path: string): string {
    const m = path.trim().match(/\.([a-zA-Z0-9]{1,12})$/);
    return m ? `.${m[1].toLowerCase()}` : '.bin';
  }

  private safeFileBaseName(title: string): string {
    let s = (title || 'template').trim().replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_');
    return s.length > 120 ? s.slice(0, 120) : s;
  }

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
    if (!title || !description) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.zip,.rar,.7z,.png,.jpg,.jpeg,.ppt,.pptx';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      this.templateService
        .addTemplateWithFile(file, {
          title,
          description,
          isVisible: true,
          displayOrder: 0
        })
        .subscribe(() => {
          this.templateService.getVisibleTemplates().subscribe((templates) => {
            this.templates = templates;
          });
        });
    };
    input.click();
  }
}
