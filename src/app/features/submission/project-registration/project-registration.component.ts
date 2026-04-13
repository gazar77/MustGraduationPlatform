import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { ProjectSubmissionService } from '../../../core/services/project-submission.service';

@Component({
  selector: 'app-project-registration',
  templateUrl: './project-registration.component.html',
  styleUrls: ['./project-registration.component.scss']
})
export class ProjectRegistrationComponent implements OnInit {
  titleKey = '';
  instructionsKey = '';
  deadline = '2026-05-15';
  /** Up to 6 files for project registration phases */
  selectedFiles: File[] = [];
  readonly maxFiles = 6;
  registrationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public langService: LanguageService,
    private projectSubmissionService: ProjectSubmissionService
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      projectNumber: ['', Validators.required],
      projectTitle: ['', Validators.required],
      supervisorName: ['', Validators.required],
      teamLeaderName: ['', Validators.required],
      notes: ['']
    });

    this.route.data.subscribe((data) => {
      const type = data['type'];
      if (type === 'reg1') {
        this.titleKey = 'submission.registration.reg1Title';
        this.instructionsKey = 'submission.registration.reg1Instructions';
      } else {
        this.titleKey = 'submission.registration.reg2Title';
        this.instructionsKey = 'submission.registration.reg2Instructions';
        this.deadline = '2026-06-20';
      }
    });
  }

  private static readonly allowedExt = new Set([
    '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.zip', '.rar', '.7z', '.png', '.jpg', '.jpeg'
  ]);
  private static readonly maxBytes = 25 * 1024 * 1024;

  private validateFile(file: File): boolean {
    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
    if (!ProjectRegistrationComponent.allowedExt.has(ext) || file.size > ProjectRegistrationComponent.maxBytes) {
      const ar = typeof localStorage !== 'undefined' && localStorage.getItem('lang') === 'ar';
      alert(ar ? 'نوع الملف غير مسموح أو الحجم يتجاوز 25 ميجابايت.' : 'File type not allowed or file exceeds 25 MB.');
      return false;
    }
    return true;
  }

  onFilesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const picked = input.files;
    if (!picked?.length) {
      input.value = '';
      return;
    }
    const next: File[] = [...this.selectedFiles];
    for (let i = 0; i < picked.length; i++) {
      if (next.length >= this.maxFiles) break;
      const file = picked.item(i)!;
      if (next.some((f) => f.name === file.name && f.size === file.size)) continue;
      if (!this.validateFile(file)) continue;
      next.push(file);
    }
    this.selectedFiles = next;
    input.value = '';
  }

  removeFile(index: number): void {
    this.selectedFiles = this.selectedFiles.filter((_, i) => i !== index);
  }

  onSubmit(): void {
    if (this.registrationForm.valid && this.selectedFiles.length > 0) {
      this.route.data.subscribe((data) => {
        const type = data['type'] === 'reg1' ? 'project1' : 'project2';
        const v = this.registrationForm.value;
        const fd = new FormData();
        fd.append('type', type);
        fd.append('studentName', v.teamLeaderName);
        fd.append('teamLeaderName', v.teamLeaderName);
        fd.append('projectNumber', v.projectNumber);
        fd.append('projectTitle', v.projectTitle);
        fd.append('supervisorName', v.supervisorName);
        fd.append('notes', v.notes ?? '');
        this.selectedFiles.forEach((f) => fd.append('Files', f, f.name));
        this.projectSubmissionService.addSubmissionWithFile(fd).subscribe({
          next: () => {
            alert(this.langService.translate('submission.registration.successMsg') + ' ' + this.langService.translate(this.titleKey));
            this.selectedFiles = [];
            this.registrationForm.reset();
          },
          error: () => {
            alert('Upload failed. Check the API and that wwwroot/uploads is writable.');
          }
        });
      });
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }
}
