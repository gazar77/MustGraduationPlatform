import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Idea } from '../../../core/models/idea.model';
import { IdeaService } from '../../../core/services/idea.service';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
import { LanguageService } from '../../../core/services/language.service';
import { switchMap, of, map, catchError, forkJoin, finalize } from 'rxjs';

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
  /** When site setting IdeaReservationsOpen is false, reservation CTAs are disabled. */
  reservationsOpen = true;
  reserveBusy = false;

  constructor(
    private route: ActivatedRoute,
    private ideaService: IdeaService,
    private siteSettings: SiteSettingsService,
    public lang: LanguageService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          return of<{ status: 'invalid_id' } | { status: 'ok'; idea: Idea; reservationsOpen: boolean } | { status: 'http_error' }>(
            { status: 'invalid_id' }
          );
        }
        const numId = Number(id);
        return forkJoin({
          idea: this.ideaService.getIdeaById(numId),
          setting: this.siteSettings.getSetting('IdeaReservationsOpen').pipe(
            catchError(() => of({ key: 'IdeaReservationsOpen', value: 'true' }))
          )
        }).pipe(
          map(({ idea, setting }) => ({
            status: 'ok' as const,
            idea,
            reservationsOpen: this.parseReservationsOpen(setting.value)
          })),
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
        this.reservationsOpen = res.reservationsOpen;
      }
    });
  }

  private parseReservationsOpen(raw: string): boolean {
    const v = this.siteSettings.parseStoredValue(raw ?? '').trim().toLowerCase();
    return v !== 'false';
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

  get reservationButtonDisabled(): boolean {
    if (!this.idea) return true;
    return this.reserveBusy || !this.reservationsOpen || this.idea.status !== 'Open';
  }

  get reservationButtonLabel(): string {
    if (!this.idea) return '';
    if (!this.reservationsOpen) {
      return this.lang.translate('ideas.detail.masterClosed');
    }
    if (this.idea.status !== 'Open') {
      return this.getStatusArabic(this.idea.status);
    }
    return this.lang.translate('ideas.detail.reserveBtn');
  }

  onReserve(): void {
    if (!this.idea || this.reservationButtonDisabled) return;
    this.reserveBusy = true;
    this.ideaService.reserveIdea(this.idea.id).pipe(
      finalize(() => { this.reserveBusy = false; })
    ).subscribe({
      next: (idea) => {
        this.idea = idea;
        alert(this.lang.translate('ideas.detail.reserveSuccess'));
      },
      error: (err: { error?: { message?: string } }) => {
        const msg = err?.error?.message || this.lang.translate('ideas.detail.reserveFailed');
        alert(msg);
      }
    });
  }
}
