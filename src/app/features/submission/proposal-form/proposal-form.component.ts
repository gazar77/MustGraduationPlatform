import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { ProposalService } from '../../../core/services/proposal.service';

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

  constructor(private fb: FormBuilder, public langService: LanguageService, private proposalService: ProposalService) {
    this.proposalForm = this.fb.group({
      projectName: ['', Validators.required],
      teamName: ['', Validators.required],
      teamMembers: ['', Validators.required],
      department: ['', Validators.required],
      supervisor: ['', Validators.required],
      idea: ['', [Validators.required, Validators.minLength(50)]],
      goals: ['', Validators.required],
      description: ['', Validators.required],
      tools: ['', Validators.required],
      notes: [''],
      attachment: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.calculateDeadline();
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
      const file = event.target.files[0];
      this.proposalForm.patchValue({
        attachment: file
      });
    }
  }

  onSubmit(): void {
    if (this.proposalForm.valid && this.submissionStatus !== 'closed') {
      const val = this.proposalForm.value;
      this.proposalService.addProposal({
        projectName: val.projectName,
        teamName: val.teamName,
        members: val.teamMembers ? val.teamMembers.split(',').map((x: string) => x.trim()) : [],
        department: val.department,
        proposedSupervisor: val.supervisor,
        idea: val.idea,
        goals: val.goals,
        description: val.description,
        tools: val.tools ? val.tools.split(',').map((x: string) => x.trim()) : [],
        notes: val.notes,
        attachment: val.attachment ? val.attachment.name : undefined
      }).subscribe(() => {
        alert(this.langService.translate('submission.proposal.successMsg'));
        this.proposalForm.reset();
      });
    }
  }
}
