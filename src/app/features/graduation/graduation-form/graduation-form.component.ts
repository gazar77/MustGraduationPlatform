import { Component, OnInit } from '@angular/core';
import { GraduationService } from '../../../core/services/graduation.service';

@Component({
  selector: 'app-graduation-form',
  templateUrl: './graduation-form.component.html',
  styleUrls: ['./graduation-form.component.scss']
})
export class GraduationFormComponent implements OnInit {
  today: Date = new Date();

  loading = true;
  error = '';

  projectInfo = {
    title: '',
    department: '',
    supervisorName: '',
    students: [] as { id: string; name: string; department: string }[]
  };

  constructor(private graduation: GraduationService) {}

  ngOnInit(): void {
    this.graduation.getMyProject().subscribe({
      next: (p) => {
        this.projectInfo = {
          title: p.title,
          department: p.department,
          supervisorName: p.supervisorName,
          students: (p.students ?? []).map((s) => ({
            id: s.studentId,
            name: s.name,
            department: s.department
          }))
        };
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err?.status === 404) {
          this.error = 'لا توجد بيانات مشروع مرتبطة بحسابك. تأكد من تسجيل مقترح يتضمن بريدك ضمن أعضاء الفريق.';
        } else {
          this.error = 'تعذر تحميل بيانات المشروع. حاول مرة أخرى لاحقاً.';
        }
      }
    });
  }
}
