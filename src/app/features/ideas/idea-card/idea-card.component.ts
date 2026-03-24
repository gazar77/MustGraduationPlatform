import { Component, Input, OnInit } from '@angular/core';
import { Idea } from '../../../core/models/idea.model';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-idea-card',
  templateUrl: './idea-card.component.html',
  styleUrls: ['./idea-card.component.scss']
})
export class IdeaCardComponent implements OnInit {
  @Input() idea!: Idea;

  constructor(public langService: LanguageService) { }

  ngOnInit(): void {
  }

  getStatusTranslation(status: string): string {
    return this.langService.translate(`ideas.status.${status}`) || status;
  }

  getDifficultyTranslation(difficulty: string): string {
    return this.langService.translate(`ideas.difficulty.${difficulty}`) || difficulty;
  }
}
