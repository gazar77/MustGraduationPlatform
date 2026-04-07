import { Component, OnInit } from '@angular/core';
import { News } from '../../../core/models/news.model';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
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
  currentUser: User | null = null;

  constructor(
    private newsService: NewsService, 
    private authService: AuthService,
    public langService: LanguageService
  ) { }

  ngOnInit(): void {
    this.newsService.getVisibleNews().subscribe(news => {
      this.newsItems = news;
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  getCategoryTranslation(category: string): string {
    return this.langService.translate(`news.list.category.${category}`) || category;
  }

  newsImageUrl(item: News): string {
    return fileUrlToAbsolute(item.imagePath);
  }

  onAddNews(): void {
    const titlePrompt = this.langService.translate('news.list.prompts.newTitle');
    const contentPrompt = this.langService.translate('news.list.prompts.newContent');
    
    const title = prompt(titlePrompt);
    const content = prompt(contentPrompt);
    if (title && content) {
      this.newsService.addNews({
        id: 0,
        title,
        content,
        publishDate: new Date(),
        author: this.currentUser?.name || 'Admin',
        category: 'Announcement',
        isVisible: true,
        order: 0
      }).subscribe(() => {
        // Refresh list
        this.newsService.getNews().subscribe(news => this.newsItems = news);
      });
    }
  }
}
