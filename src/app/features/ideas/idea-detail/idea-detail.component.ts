import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Idea } from '../../../core/models/idea.model';
import { IdeaService } from '../../../core/services/idea.service';
import { switchMap, of, map, catchError } from 'rxjs';

@Component({
  selector: 'app-idea-detail',
  templateUrl: './idea-detail.component.html',
  styleUrls: ['./idea-detail.component.scss'],
  standalone: false
})
export class IdeaDetailComponent implements OnInit {
  idea?: Idea;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private ideaService: IdeaService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          return of<{ status: 'invalid_id' } | { status: 'ok'; idea: Idea } | { status: 'http_error' }>(
            { status: 'invalid_id' }
          );
        }
        return this.ideaService.getIdeaById(Number(id)).pipe(
          map((idea: Idea) => ({ status: 'ok' as const, idea })),
          catchError(() => of({ status: 'http_error' as const }))
        );
      })
    ).subscribe(res => {
      this.loading = false;
      if (res.status === 'invalid_id') {
        this.error = 'معرف الفكرة غير صالح';
        return;
      }
      if (res.status === 'http_error') {
        this.error = 'تعذر تحميل الفكرة أو غير موجودة.';
        return;
      }
      if (res.status === 'ok') {
        this.error = null;
        this.idea = res.idea;
      }
    });
  }

  getStatusArabic(status: string): string {
    const map: { [key: string]: string } = {
      'Open': 'متاح',
      'Reserved': 'محجوز',
      'Approved': 'معتمد',
      'Closed': 'مغلق'
    };
    return map[status] || status;
  }

  getDifficultyArabic(difficulty: string): string {
    const map: { [key: string]: string } = {
      'Easy': 'سهل',
      'Medium': 'متوسط',
      'Hard': 'صعب'
    };
    return map[difficulty] || difficulty;
  }
}
