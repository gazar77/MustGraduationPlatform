import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Proposal } from '../models/proposal.model';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  private mockProposals: Proposal[] = [
    {
      id: 1,
      projectName: 'نظام تحليل الأشعة الذكي',
      teamName: 'Alpha Team',
      members: ['أحمد محمد', 'سارة علي', 'ياسين محمود'],
      department: 'علوم الحاسب',
      proposedSupervisor: 'د. محمود حسن',
      description: 'نخطط لاستخدام تقنيات تعلم الآلة العميقة لتحليل صور الأشعة...',
      tools: ['Python', 'TensorFlow', 'Flask'],
      submissionDate: new Date('2026-03-20'),
      idea: 'تطوير نموذج مختلط يقدم تحليلا فوريا',
      goals: '1. زيادة دقة التشخيص 2. تقليل وقت الاستجابة',
      notes: '',
      status: 'Pending'
    },
    {
      id: 2,
      projectName: 'تطبيق الإرشاد الزراعي',
      teamName: 'Visionaries',
      members: ['منى يوسف', 'كريم حسن'],
      department: 'نظم المعلومات',
      proposedSupervisor: 'د. سمر خالد',
      description: 'تطبيق موبايل يربط بين المزارعين والخبراء الزراعيين...',
      tools: ['Flutter', 'Firebase'],
      status: 'Approved',
      submissionDate: new Date('2026-03-18'),
      idea: 'ربط المعرفة الزراعية الحديثة بالمزارعين',
      goals: '1. رفع الإنتاجية الزراعية 2. تقليل الخسائر بسبب الآفات',
      notes: ''
    }
  ];

  constructor() { }

  getProposals(): Observable<Proposal[]> {
    return of(this.mockProposals);
  }

  getProposalById(id: number): Observable<Proposal | undefined> {
    return of(this.mockProposals.find(p => p.id === id));
  }

  updateProposalStatus(id: number, status: Proposal['status']): Observable<Proposal | undefined> {
    const index = this.mockProposals.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockProposals[index].status = status;
      return of(this.mockProposals[index]);
    }
    return of(undefined);
  }

  addProposal(proposal: Omit<Proposal, 'id' | 'status' | 'submissionDate'>): Observable<Proposal> {
    const newProposal: Proposal = {
      ...proposal,
      id: Date.now(),
      status: 'New',
      submissionDate: new Date()
    };
    this.mockProposals.push(newProposal);
    return of(newProposal);
  }

  deleteProposal(id: number): Observable<boolean> {
    const index = this.mockProposals.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockProposals.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
