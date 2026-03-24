import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Idea } from '../models/idea.model';

@Injectable({
  providedIn: 'root'
})
export class IdeaService {
  // TODO: Connect to backend .NET API
  // private apiUrl = 'https://localhost:5001/api/ideas';

  private mockIdeas: Idea[] = [
    {
      id: 1,
      title: 'نظام إدارة مشاريع التخرج الذكي',
      description: 'نظام متكامل لإدارة عملية اختيار وتتبع مشاريع التخرج باستخدام تقنيات الويب الحديثة.',
      category: 'تطوير مواقع ويب',
      difficulty: 'Medium',
      requiredSkills: ['Angular', '.NET Core', 'SQL Server'],
      maxTeamSize: 4,
      supervisorDoctorId: 101,
      supervisorName: 'د. محمد علي',
      createdAt: new Date(),
      status: 'Open',
      isVisible: true,
      order: 1
    },
    {
      id: 2,
      // ... same for others
      title: 'تطبيق مراقبة الصحة الشخصية',
      description: 'تطبيق موبايل يساعد المستخدمين على تتبع حالتهم الصحية والأنشطة الرياضية باستخدام أجهزة الاستشعار.',
      category: 'تطوير تطبيقات موبايل',
      difficulty: 'Hard',
      requiredSkills: ['Flutter', 'Firebase', 'IoT'],
      maxTeamSize: 5,
      supervisorDoctorId: 102,
      supervisorName: 'د. سارة عادل',
      createdAt: new Date(),
      status: 'Reserved',
      isVisible: true,
      order: 2
    },
    {
      id: 3,
      title: 'نظام كشف الاحتيال المالي',
      description: 'استخدام تقنيات تعلم الآلة للكشف عن المعاملات المالية المشبوهة في الوقت الحقيقي.',
      category: 'تعلم الآلة',
      difficulty: 'Hard',
      requiredSkills: ['Python', 'TensorFlow', 'Data Analysis'],
      maxTeamSize: 3,
      supervisorDoctorId: 103,
      supervisorName: 'د. أحمد حسن',
      createdAt: new Date(),
      status: 'Approved',
      isVisible: true,
      order: 3
    },
    {
      id: 4,
      title: 'بوابة الخدمات الطلابية',
      description: 'منصة موحدة لتقديم جميع الخدمات التي يحتاجها الطالب خلال مسيرته الجامعية.',
      category: 'تطوير مواقع ويب',
      difficulty: 'Easy',
      requiredSkills: ['HTML', 'CSS', 'JavaScript'],
      maxTeamSize: 4,
      supervisorDoctorId: 101,
      supervisorName: 'د. محمد علي',
      createdAt: new Date(),
      status: 'Open',
      isVisible: true,
      order: 4
    }
  ];

  constructor(private http: HttpClient) { }

  getIdeas(): Observable<Idea[]> {
    return of(this.mockIdeas);
  }

  getVisibleIdeas(): Observable<Idea[]> {
    return of(this.mockIdeas.filter(i => i.isVisible).sort((a, b) => (a.order || 0) - (b.order || 0)));
  }

  getIdeaById(id: number): Observable<Idea | undefined> {
    const idea = this.mockIdeas.find(i => i.id === id);
    return of(idea);
  }

  addIdea(idea: Idea): Observable<Idea> {
    const newId = Math.max(...this.mockIdeas.map(i => i.id || 0)) + 1;
    const newIdea = { ...idea, id: newId, createdAt: new Date(), isVisible: true };
    this.mockIdeas.push(newIdea);
    return of(newIdea);
  }

  updateIdea(id: number, data: Partial<Idea>): Observable<Idea | undefined> {
    const index = this.mockIdeas.findIndex(i => i.id === id);
    if (index !== -1) {
      this.mockIdeas[index] = { ...this.mockIdeas[index], ...data };
      return of(this.mockIdeas[index]);
    }
    return of(undefined);
  }

  deleteIdea(id: number): Observable<boolean> {
    const index = this.mockIdeas.findIndex(i => i.id === id);
    if (index !== -1) {
      this.mockIdeas.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  toggleVisibility(id: number): Observable<Idea | undefined> {
    const index = this.mockIdeas.findIndex(i => i.id === id);
    if (index !== -1) {
      this.mockIdeas[index].isVisible = !this.mockIdeas[index].isVisible;
      return of(this.mockIdeas[index]);
    }
    return of(undefined);
  }
}
