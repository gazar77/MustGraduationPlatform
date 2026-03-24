import { Component } from '@angular/core';
import { IdeaService } from '../../../core/services/idea.service';
import { Router } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';

@Component({
    selector: 'app-idea-register',
    templateUrl: './idea-register.component.html',
    styleUrls: ['./idea-register.component.scss'],
    standalone: false
})
export class IdeaRegisterComponent {
    formData = {
        title: '',
        description: '',
        category: '' as any,
        teamSize: 4,
        leaderName: '',
        leaderId: ''
    };

    constructor(private ideaService: IdeaService, private router: Router, public langService: LanguageService) {}

    onSubmit() {
        this.ideaService.addIdea({
            id: 0,
            title: this.formData.title,
            description: this.formData.description,
            category: this.formData.category || 'تطوير مواقع ويب',
            difficulty: 'Medium',
            requiredSkills: [],
            maxTeamSize: this.formData.teamSize,
            supervisorName: this.formData.leaderName,
            createdAt: new Date(),
            status: 'Open',
            isVisible: false,
            order: 0
        }).subscribe(() => {
            alert(this.langService.translate('ideas.register.successMsg'));
            this.router.navigate(['/ideas']);
        });
    }
}
