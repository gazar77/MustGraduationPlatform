import { Component, OnInit } from '@angular/core';
import { News } from '../../../core/models/news.model';
import { LanguageService } from '../../../core/services/language.service';
import { NewsService } from '../../../core/services/news.service';
import { fileUrlToAbsolute } from '../../../core/utils/api-url.util';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit {
  newsItems: News[] = [];
  carouselStart = 0;
  readonly pageSize = 3;

  constructor(
    private newsService: NewsService,
    public langService: LanguageService
  ) { }

  ngOnInit(): void {
    this.newsService.getVisibleNews().subscribe(news => {
      this.newsItems = news;
      this.carouselStart = 0;
    });
  }

  get visibleNews(): News[] {
    return this.newsItems.slice(this.carouselStart, this.carouselStart + this.pageSize);
  }

  get canSlidePrev(): boolean {
    return this.carouselStart > 0;
  }

  get canSlideNext(): boolean {
    return this.carouselStart + this.pageSize < this.newsItems.length;
  }

  slidePrev(): void {
    if (this.canSlidePrev) {
      this.carouselStart--;
    }
  }

  slideNext(): void {
    if (this.canSlideNext) {
      this.carouselStart++;
    }
  }

  newsImageUrl(item: News): string {
    return fileUrlToAbsolute(item.imagePath);
  }
}
