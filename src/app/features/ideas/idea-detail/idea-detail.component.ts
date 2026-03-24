import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Idea } from '../../../core/models/idea.model';

@Component({
  selector: 'app-idea-detail',
  templateUrl: './idea-detail.component.html',
  styleUrls: ['./idea-detail.component.scss'],
  standalone: false
})
export class IdeaDetailComponent implements OnInit {
  idea?: Idea;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // In a real app, fetch from service. Mocking for now.
    if (id) {
      this.idea = {
        id: Number(id),
        title: 'نظام إدارة مشاريع التخرج الذكي',
        description: 'مشروع يهدف إلى تسهيل عملية تسجيل ومتابعة مشاريع التخرج بكلية الحاسبات والمعلومات بجامعة مصر للعلوم والتكنولوجيا، مع دعم كامل للذكاء الاصطناعي في توزيع اللجان وتقييم المقترحات.',
        category: 'الذكاء الاصطناعي',
        status: 'Open',
        difficulty: 'Hard',
        maxTeamSize: 4,
        supervisorDoctorId: 1,
        supervisorName: 'د. أحمد علي',
        requiredSkills: ['Angular', 'Node.js', 'Python', 'TensorFlow'],
        createdAt: new Date(),
        isVisible: true,
        order: 0
      };
    }
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
