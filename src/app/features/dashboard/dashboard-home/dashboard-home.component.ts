import { Component, OnInit, OnDestroy } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { NewsService } from '../../../core/services/news.service';
import { IdeaService } from '../../../core/services/idea.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { Observable } from 'rxjs';
import { News } from '../../../core/models/news.model';
import { Idea } from '../../../core/models/idea.model';
import { DashboardStats } from '../../../core/models/dashboard-stats.model';

interface SlideItem {
  image: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  private slideInterval: any;

  slides: SlideItem[];
  news$: Observable<News[]>;
  ideas$: Observable<Idea[]>;
  stats$: Observable<DashboardStats>;

  constructor(
    public langService: LanguageService,
    private newsService: NewsService,
    private ideaService: IdeaService,
    private dashboardService: DashboardService
  ) {
    this.news$ = this.newsService.getVisibleNews();
    this.ideas$ = this.ideaService.getVisibleIdeas();
    this.stats$ = this.dashboardService.getStats();

    this.slides = [
      {
        image: 'assets/must_discussion_1.png',
        title: this.langService.translate('dashboard.heroTitle'),
        description: 'المنصة المتكاملة لإدارة ومتابعة مشاريع التخرج بكلية الحاسبات والمعلومات - جامعة مصر للعلوم والتكنولوجيا'
      },
      {
        image: 'assets/must_discussion_2.png',
        title: 'أفكار مشاريع مبتكرة',
        description: 'استكشف أحدث الأفكار والتقنيات المقترحة لمشاريع التخرج لهذا العام'
      },
      {
        image: 'assets/must_discussion_3.png',
        title: 'مستقبلك يبدأ من هنا',
        description: 'سجل مشروعك وتابع خطوات النجاح مع نخبة من أفضل الأساتذة والخبراء'
      }
    ];
  }

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoPlay() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}
