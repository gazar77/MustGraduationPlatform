import { Component, OnInit } from '@angular/core';
import { IdeaService } from '../../../core/services/idea.service';
import { IdeaCategoryService } from '../../../core/services/idea-category.service';
import { AuthService } from '../../../core/services/auth.service';
import { Idea } from '../../../core/models/idea.model';
import { User } from '../../../core/models/user.model';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-idea-list',
  templateUrl: './idea-list.component.html',
  styleUrls: ['./idea-list.component.scss']
})
export class IdeaListComponent implements OnInit {
  allIdeas: Idea[] = [];
  filteredIdeas: Idea[] = [];
  searchQuery: string = '';
  selectedCategory: string = '';
  currentUser: User | null = null;

  categories: string[] = [];

  constructor(
    private ideaService: IdeaService,
    private ideaCategoryService: IdeaCategoryService,
    private authService: AuthService,
    public langService: LanguageService
  ) { }

  ngOnInit(): void {
    this.ideaCategoryService.getVisible().subscribe(cats => {
      this.categories = cats.map(c => c.name);
    });

    this.ideaService.getVisibleIdeas().subscribe(ideas => {
      this.allIdeas = ideas;
      this.filteredIdeas = ideas;
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  filterIdeas(): void {
    this.filteredIdeas = this.allIdeas.filter(idea => {
      const matchesSearch = idea.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory ? idea.category === this.selectedCategory : true;

      return matchesSearch && matchesCategory;
    });
  }
}
