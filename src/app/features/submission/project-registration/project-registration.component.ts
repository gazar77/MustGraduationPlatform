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
  selectedFile: File | null = null;
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

    this.route.data.subscribe(data => {
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

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit(): void {
    if (this.registrationForm.valid && this.selectedFile) {
      this.route.data.subscribe(data => {
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
        fd.append('file', this.selectedFile!, this.selectedFile!.name);
        this.projectSubmissionService.addSubmissionWithFile(fd).subscribe({
          next: () => {
            alert(this.langService.translate('submission.registration.successMsg') + ' ' + this.langService.translate(this.titleKey));
            this.selectedFile = null;
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
