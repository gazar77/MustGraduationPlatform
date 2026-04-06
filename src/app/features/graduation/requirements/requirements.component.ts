import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GraduationService } from '../../../core/services/graduation.service';
import { fileUrlToAbsolute } from '../../../core/utils/api-url.util';

@Component({
  selector: 'app-requirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.scss'],
  standalone: false
})
export class GraduationRequirementsComponent implements OnInit {
  requirementNumber = '1';
  title = '';
  selectedFile: File | null = null;
  uploading = false;
  successMessage = '';
  errorMessage = '';
  lastUploadUrl = '';

  constructor(
    private route: ActivatedRoute,
    private graduation: GraduationService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.requirementNumber = data['number'] || '1';
      this.title = `متطلبات المشروع (${this.requirementNumber})`;
      this.graduation.getMyRequirementFiles().subscribe((files) => {
        const match = files.find((f) => f.requirementKey === this.requirementNumber);
        if (match) {
          this.lastUploadUrl = fileUrlToAbsolute(match.fileUrl);
        }
      });
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.selectedFile = file ?? null;
    this.successMessage = '';
    this.errorMessage = '';
  }

  submit(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'يرجى اختيار ملف أولاً.';
      return;
    }
    this.uploading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.graduation.uploadRequirement(this.requirementNumber, this.selectedFile).subscribe({
      next: (r) => {
        this.lastUploadUrl = fileUrlToAbsolute(r.fileUrl);
        this.successMessage = `تم رفع الملف بنجاح: ${r.fileName}`;
        this.uploading = false;
        this.selectedFile = null;
      },
      error: () => {
        this.errorMessage = 'فشل الرفع. تحقق من نوع الحجم (حتى 25 ميجا) وحاول مرة أخرى.';
        this.uploading = false;
      }
    });
  }
}
