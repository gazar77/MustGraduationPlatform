import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroBannerComponent } from '../../shared/components/hero-banner/hero-banner.component';
import { LanguageService } from '../../core/services/language.service';
import { TutorialDocumentService } from '../../core/services/tutorial-document.service';
import { TutorialDocument } from '../../core/models/tutorial-document.model';
import { fileUrlToAbsolute } from '../../core/utils/api-url.util';

@Component({
  selector: 'app-tutorials-page',
  standalone: true,
  imports: [CommonModule, HeroBannerComponent],
  templateUrl: './tutorials-page.component.html',
  styleUrl: './tutorials-page.component.scss'
})
export class TutorialsPageComponent implements OnInit {
  documents: TutorialDocument[] = [];
  loading = true;

  constructor(
    public lang: LanguageService,
    private tutorialService: TutorialDocumentService
  ) {}

  ngOnInit(): void {
    this.tutorialService.getTutorialDocuments().subscribe({
      next: (list) => {
        this.documents = [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        this.loading = false;
      },
      error: () => {
        this.documents = [];
        this.loading = false;
      }
    });
  }

  canDownload(doc: TutorialDocument): boolean {
    const u = doc.fileUrl?.trim();
    return !!u && u !== '#';
  }

  downloadDoc(doc: TutorialDocument): void {
    if (!this.canDownload(doc)) return;
    this.tutorialService.downloadFile(doc.id).subscribe({
      next: (blob) => {
        const ext = this.extensionFromPath(doc.fileUrl);
        const base = this.safeFileBaseName(doc.title);
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = `${base}${ext}`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => {
        window.open(fileUrlToAbsolute(doc.fileUrl), '_blank', 'noopener,noreferrer');
      }
    });
  }

  fileIconClass(fileUrl: string): string {
    const ext = (fileUrl?.split('.').pop() || '').toLowerCase();
    if (ext === 'pdf') return 'fa-file-pdf';
    if (ext === 'ppt' || ext === 'pptx') return 'fa-file-powerpoint';
    if (ext === 'doc' || ext === 'docx') return 'fa-file-word';
    return 'fa-file-alt';
  }

  private extensionFromPath(path: string): string {
    const m = path.trim().match(/\.([a-zA-Z0-9]{1,12})$/);
    return m ? `.${m[1].toLowerCase()}` : '.bin';
  }

  private safeFileBaseName(title: string): string {
    let s = (title || 'tutorial').trim().replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_');
    return s.length > 120 ? s.slice(0, 120) : s;
  }
}
