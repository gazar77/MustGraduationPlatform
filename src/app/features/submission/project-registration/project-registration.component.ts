import { Component, OnInit } from '@angular/core';
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
  notes = '';

  constructor(private route: ActivatedRoute, public langService: LanguageService, private projectSubmissionService: ProjectSubmissionService) {}

  ngOnInit(): void {
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
    if (this.selectedFile) {
      this.route.data.subscribe(data => {
        const type = data['type'] === 'reg1' ? 'project1' : 'project2';
        this.projectSubmissionService.addSubmission({
            type,
            studentName: 'مستخدم مسجل',
            fileName: this.selectedFile!.name,
            notes: this.notes
        }).subscribe(() => {
            alert(this.langService.translate('submission.registration.successMsg') + this.langService.translate(this.titleKey));
            this.selectedFile = null;
            this.notes = '';
        });
      });
    }
  }
}
