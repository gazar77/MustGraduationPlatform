import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { ProjectSubmissionService } from '../../../core/services/project-submission.service';
import { SiteSettingsService } from '../../../core/services/site-settings.service';

@Component({
  selector: 'app-proposal-form',
  templateUrl: './proposal-form.component.html',
  styleUrls: ['./proposal-form.component.scss']
})
export class ProposalFormComponent implements OnInit {
  proposalForm: FormGroup;
  deadlineDate = new Date('2026-04-30T23:59:59');
  submissionStatus: 'open' | 'closing' | 'closed' = 'open';
  daysLeft = 0;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder, 
    public langService: LanguageService, 
    private projectSubmissionService: ProjectSubmissionService,
    private siteSettingsService: SiteSettingsService
  ) {
    this.proposalForm = this.fb.group({
      projectNumber: ['', Validators.required],
      projectTitle: ['', Validators.required],
      supervisorName: ['', Validators.required],
      teamLeaderName: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.siteSettingsService.getSetting('proposalDeadline').subscribe(res => {
      const s = this.siteSettingsService.parseStoredValue(res.value);
      const d = new Date(s);
      if (!isNaN(d.getTime())) {
        this.deadlineDate = d;
      }
      this.calculateDeadline();
    });
  }

  calculateDeadline(): void {
    const now = new Date();
    const diff = this.deadlineDate.getTime() - now.getTime();
    this.daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (diff <= 0) {
      this.submissionStatus = 'closed';
    } else if (this.daysLeft <= 7) {
      this.submissionStatus = 'closing';
    } else {
      this.submissionStatus = 'open';
    }
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit(): void {
    if (this.proposalForm.valid && this.selectedFile && this.submissionStatus !== 'closed') {
      const val = this.proposalForm.value;
      const fd = new FormData();
      fd.append('type', 'proposal');
      fd.append('studentName', val.teamLeaderName);
      fd.append('teamLeaderName', val.teamLeaderName);
      fd.append('projectNumber', val.projectNumber);
      fd.append('projectTitle', val.projectTitle);
      fd.append('supervisorName', val.supervisorName);
      fd.append('notes', val.notes ?? '');
      fd.append('file', this.selectedFile, this.selectedFile.name);
      this.projectSubmissionService.addSubmissionWithFile(fd).subscribe({
        next: () => {
          alert(this.langService.translate('submission.proposal.successMsg') || 'Submission Successful!');
          this.proposalForm.reset();
          this.selectedFile = null;
        },
        error: () => {
          alert(this.langService.translate('submission.proposal.errorMsg') || 'Upload failed. Check the API and wwwroot/uploads.');
        }
      });
    } else {
        this.proposalForm.markAllAsTouched();
    }
  }
}
