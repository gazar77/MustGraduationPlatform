import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IdeaService } from '../../../core/services/idea.service';

@Component({
  selector: 'app-idea-management',
  templateUrl: './idea-management.component.html',
  styleUrl: './idea-management.component.scss'
})
export class IdeaManagementComponent implements OnInit {
  form: FormGroup;
  loading = false;
  saving = false;
  error = '';
  editingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ideaService: IdeaService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['تطوير مواقع ويب', Validators.required],
      difficulty: ['Medium', Validators.required],
      maxTeamSize: [4, [Validators.required, Validators.min(1), Validators.max(20)]],
      status: ['Open', Validators.required],
      isVisible: [true],
      displayOrder: [0, [Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const url = this.router.url;
    const editMatch = /\/doctor\/ideas\/edit\/(\d+)/.exec(url);
    if (editMatch) {
      this.editingId = +editMatch[1];
      this.loading = true;
      this.ideaService.getIdeaById(this.editingId).subscribe({
        next: (idea) => {
          this.form.patchValue({
            title: idea.title,
            description: idea.description,
            category: idea.category,
            difficulty: idea.difficulty,
            maxTeamSize: idea.maxTeamSize,
            status: idea.status,
            isVisible: idea.isVisible,
            displayOrder: idea.order ?? 0
          });
          this.loading = false;
        },
        error: () => {
          this.error = 'تعذر تحميل الفكرة.';
          this.loading = false;
        }
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const body = {
      title: v.title,
      description: v.description,
      category: v.category,
      difficulty: v.difficulty,
      requiredSkills: [] as string[],
      maxTeamSize: v.maxTeamSize,
      supervisorDoctorId: null as number | null,
      supervisorName: '',
      status: v.status,
      isVisible: v.isVisible,
      displayOrder: v.displayOrder ?? 0
    };

    this.saving = true;
    this.error = '';
    if (this.editingId != null) {
      this.ideaService.updateIdea(this.editingId, body as any).subscribe({
        next: () => this.router.navigateByUrl('/doctor'),
        error: () => {
          this.error = 'فشل الحفظ.';
          this.saving = false;
        }
      });
    } else {
      this.ideaService.addIdea({ ...(body as any), id: 0, createdAt: new Date(), supervisorName: '' } as any).subscribe({
        next: () => this.router.navigateByUrl('/doctor'),
        error: () => {
          this.error = 'فشل إنشاء الفكرة.';
          this.saving = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigateByUrl('/doctor');
  }
}
