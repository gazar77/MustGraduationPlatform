import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../../../core/services/news.service';
import { EventService } from '../../../core/services/event.service';
import { TemplateService } from '../../../core/services/template.service';
import { IdeaService } from '../../../core/services/idea.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ContactService } from '../../../core/services/contact.service';
import { ProjectSubmissionService } from '../../../core/services/project-submission.service';
import { ProposalService } from '../../../core/services/proposal.service';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.scss']
})
export class AdminManagementComponent implements OnInit {
  type: string = '';
  title: string = '';
  items: any[] = [];
  columns: { key: string, label: string }[] = [];
  editingItem: any = null;
  
  modalConfig = {
    isOpen: false,
    title: '',
    fields: [] as any[]
  };

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private eventService: EventService,
    private templateService: TemplateService,
    private ideaService: IdeaService,
    private dashboardService: DashboardService,
    private proposalService: ProposalService,
    private contactService: ContactService,
    private projectSubmissionService: ProjectSubmissionService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.type = data['type'];
      this.initView();
    });
  }

  initView() {
    switch (this.type) {
      case 'proposals':
        this.title = 'إدارة مقترحات مشاريع التخرج';
        this.columns = [
          { key: 'projectNumber', label: 'رقم المشروع' },
          { key: 'projectTitle', label: 'اسم المشروع' },
          { key: 'teamLeaderName', label: 'اسم قائد الفريق' },
          { key: 'supervisorName', label: 'المشرف المقترح' },
          { key: 'status', label: 'الحالة' }
        ];
        this.projectSubmissionService.getSubmissions('proposal').subscribe(res => this.items = res);
        break;
      case 'contact':
        this.title = 'إدارة رسائل التواصل';
        this.columns = [
          { key: 'name', label: 'الاسم' },
          { key: 'subject', label: 'الموضوع' },
          { key: 'submissionDate', label: 'التاريخ' },
          { key: 'status', label: 'الحالة' }
        ];
        this.contactService.getMessages().subscribe(res => this.items = res);
        break;
      case 'project1':
        this.title = 'إدارة تسليمات المشروع 1';
        this.columns = [
          { key: 'projectNumber', label: 'رقم المشروع' },
          { key: 'projectTitle', label: 'اسم المشروع' },
          { key: 'teamLeaderName', label: 'قائد الفريق' },
          { key: 'fileName', label: 'اسم الملف' },
          { key: 'status', label: 'الحالة' }
        ];
        this.projectSubmissionService.getSubmissions('project1').subscribe(res => this.items = res);
        break;
      case 'project2':
        this.title = 'إدارة تسليمات المشروع 2';
        this.columns = [
          { key: 'projectNumber', label: 'رقم المشروع' },
          { key: 'projectTitle', label: 'اسم المشروع' },
          { key: 'teamLeaderName', label: 'قائد الفريق' },
          { key: 'fileName', label: 'اسم الملف' },
          { key: 'status', label: 'الحالة' }
        ];
        this.projectSubmissionService.getSubmissions('project2').subscribe(res => this.items = res);
        break;
      case 'news':
        this.title = 'إدارة الأخبار والتحديثات';
        this.columns = [
          { key: 'title', label: 'العنوان' },
          { key: 'publishDate', label: 'التاريخ' },
          { key: 'author', label: 'الناشر' }
        ];
        this.newsService.getNews().subscribe(res => this.items = res);
        break;
      case 'event':
        this.title = 'إدارة الفعاليات';
        this.columns = [
          { key: 'title', label: 'الفعالية' },
          { key: 'date', label: 'التاريخ' },
          { key: 'location', label: 'المكان' }
        ];
        this.eventService.getEvents().subscribe(res => this.items = res);
        break;
      case 'template':
        this.title = 'إدارة النماذج والوثائق';
        this.columns = [
          { key: 'title', label: 'الاسم' },
          { key: 'fileSize', label: 'الحجم' },
          { key: 'lastUpdate', label: 'تحديث' }
        ];
        this.templateService.getTemplates().subscribe(res => this.items = res);
        break;
      case 'ideas':
        this.title = 'إدارة أفكار المشاريع';
        this.columns = [
          { key: 'title', label: 'عنوان المشروع' },
          { key: 'category', label: 'التصنيف' },
          { key: 'supervisorName', label: 'المشرف' },
          { key: 'status', label: 'الحالة' }
        ];
        this.ideaService.getIdeas().subscribe(res => this.items = res);
        break;
    }
  }

  onAdd() {
    this.editingItem = null;
    this.modalConfig.isOpen = true;
    this.setupModalFields();
  }

  onEdit(item: any) {
    this.editingItem = item;
    this.modalConfig.isOpen = true;
    this.setupModalFields(item);
  }

  setupModalFields(item?: any) {
    const isEdit = !!item;
    if (this.type === 'news') {
      this.modalConfig.title = isEdit ? 'تعديل خبر' : 'إضافة خبر جديد';
      this.modalConfig.fields = [
        { name: 'title', label: 'العنوان', type: 'text', value: item?.title },
        { name: 'content', label: 'المحتوى', type: 'textarea', value: item?.content },
        { name: 'category', label: 'التصنيف', type: 'select', options: ['Announcement', 'Event', 'Reminder'], value: item?.category }
      ];
    } else if (this.type === 'event') {
      this.modalConfig.title = isEdit ? 'تعديل فعالية' : 'إضافة فعالية جديدة';
      this.modalConfig.fields = [
        { name: 'title', label: 'الاسم', type: 'text', value: item?.title },
        { name: 'description', label: 'الوصف', type: 'textarea', value: item?.description },
        { name: 'date', label: 'التاريخ', type: 'date', value: item?.date },
        { name: 'location', label: 'المكان', type: 'text', value: item?.location },
        { name: 'category', label: 'التصنيف', type: 'select', options: ['academic', 'social', 'workshop', 'competition'], value: item?.category }
      ];
    } else if (this.type === 'template') {
      this.modalConfig.title = isEdit ? 'تعديل نموذج' : 'إضافة نموذج جديد';
      this.modalConfig.fields = [
        { name: 'title', label: 'الاسم', type: 'text', value: item?.title },
        { name: 'description', label: 'الوصف', type: 'textarea', value: item?.description },
        { name: 'fileSize', label: 'حجم الملف', type: 'text', value: item?.fileSize || '1.0 MB' }
      ];
    } else if (this.type === 'ideas') {
      this.modalConfig.title = isEdit ? 'تعديل فكرة مشروع' : 'إضافة فكرة مشروع جديدة';
      this.modalConfig.fields = [
        { name: 'title', label: 'عنوان المشروع', type: 'text', value: item?.title },
        { name: 'category', label: 'التصنيف', type: 'text', value: item?.category },
        { name: 'description', label: 'الوصف', type: 'textarea', value: item?.description },
        { name: 'supervisorName', label: 'اسم المشرف', type: 'text', value: item?.supervisorName },
        { name: 'status', label: 'الحالة', type: 'select', options: ['Open', 'Reserved', 'Approved', 'Closed'], value: item?.status }
      ];
    } else if (this.type === 'proposals') {
      this.modalConfig.title = 'تفاصيل وتحديث المقترح';
      this.modalConfig.fields = [
        { name: 'projectNumber', label: 'رقم المشروع', type: 'readonly', value: item?.projectNumber },
        { name: 'projectTitle', label: 'اسم المشروع', type: 'readonly', value: item?.projectTitle },
        { name: 'teamLeaderName', label: 'اسم قائد الفريق', type: 'readonly', value: item?.teamLeaderName },
        { name: 'supervisorName', label: 'المشرف المقترح', type: 'readonly', value: item?.supervisorName },
        { name: 'fileName', label: 'الملف المرفق', type: 'readonly', value: item?.fileName },
        { name: 'notes', label: 'ملاحظات الإرسال', type: 'readonly', value: item?.notes },
        { name: 'status', label: 'الحالة', type: 'select', options: ['New', 'Pending', 'Reviewed', 'Accepted', 'Rejected'], value: item?.status || 'Pending' }
      ];
    } else if (this.type === 'contact') {
      this.modalConfig.title = 'تفاصيل رسالة التواصل';
      this.modalConfig.fields = [
        { name: 'name', label: 'اسم المرسل', type: 'readonly', value: item?.name },
        { name: 'email', label: 'البريد الإلكتروني', type: 'readonly', value: item?.email },
        { name: 'subject', label: 'الموضوع', type: 'readonly', value: item?.subject },
        { name: 'message', label: 'محتوى الرسالة', type: 'readonly', value: item?.message },
        { name: 'status', label: 'حالة الرد', type: 'select', options: ['New', 'Pending', 'Reviewed', 'Accepted', 'Rejected'], value: item?.status || 'New' }
      ];
    } else if (this.type === 'project1' || this.type === 'project2') {
      this.modalConfig.title = 'تفاصيل التسليم';
      this.modalConfig.fields = [
        { name: 'projectNumber', label: 'رقم المشروع', type: 'readonly', value: item?.projectNumber },
        { name: 'projectTitle', label: 'اسم المشروع', type: 'readonly', value: item?.projectTitle },
        { name: 'teamLeaderName', label: 'اسم قائد الفريق', type: 'readonly', value: item?.teamLeaderName },
        { name: 'supervisorName', label: 'المشرف المتابع', type: 'readonly', value: item?.supervisorName },
        { name: 'fileName', label: 'الملف المرفق', type: 'readonly', value: item?.fileName },
        { name: 'notes', label: 'الملاحظات الإضافية', type: 'readonly', value: item?.notes },
        { name: 'status', label: 'تقييم التسليم', type: 'select', options: ['New', 'Pending', 'Reviewed', 'Accepted', 'Rejected'], value: item?.status || 'New' }
      ];
    }
  }

  handleSave(data: any) {
    if (this.editingItem) {
      this.performUpdate(data);
    } else {
      this.performAdd(data);
    }
  }

  private performAdd(data: any) {
    let obs: Observable<any> | undefined;
    switch (this.type) {
      case 'news': obs = this.newsService.addNews({ ...data, author: 'أدمن النظام' }); break;
      case 'event': obs = this.eventService.addEvent({ ...data }); break;
      case 'template': obs = this.templateService.addTemplate({ ...data, fileUrl: '#' }); break;
      case 'ideas': obs = this.ideaService.addIdea({ ...data, difficulty: 'Medium', requiredSkills: [], maxTeamSize: 4 }); break;
      case 'proposals': 
        const newProposal = { ...data, id: Date.now(), members: [data.leaderName], submittedAt: new Date() };
        this.items.push(newProposal);
        obs = of(newProposal);
        break;
    }

    obs?.subscribe(() => {
      this.dashboardService.addActivity({ type: this.getActivityType(), description: `تم إضافة ${this.getTranslatedType()} جديد: ${data.title || data.teamName}`, user: 'أدمن النظام' });
      this.initView();
      this.modalConfig.isOpen = false;
    });
  }

  private performUpdate(data: any) {
    let obs: Observable<any> | undefined;
    switch (this.type) {
      case 'news': obs = this.newsService.updateNews(this.editingItem.id, data); break;
      case 'event': obs = this.eventService.updateEvent(this.editingItem.id, data); break;
      case 'template': obs = this.templateService.updateTemplate(this.editingItem.id, data); break;
      case 'ideas': obs = this.ideaService.updateIdea(this.editingItem.id, data); break;
      case 'proposals': obs = this.projectSubmissionService.updateStatus(this.editingItem.id, data.status); break;
      case 'contact': obs = this.contactService.updateMessageStatus(this.editingItem.id, data.status); break;
      case 'project1':
      case 'project2': obs = this.projectSubmissionService.updateStatus(this.editingItem.id, data.status); break;
    }

    obs?.subscribe(() => {
      this.dashboardService.addActivity({ type: this.getActivityType(), description: `تم تحديث ${this.getTranslatedType()}: ${data.title || data.teamName}`, user: 'أدمن النظام' });
      this.initView();
      this.modalConfig.isOpen = false;
    });
  }

  onDelete(item: any) {
    if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      let obs: Observable<any> | undefined;
      switch (this.type) {
        case 'news': obs = this.newsService.deleteNews(item.id); break;
        case 'event': obs = this.eventService.deleteEvent(item.id); break;
        case 'template': obs = this.templateService.deleteTemplate(item.id); break;
        case 'ideas': obs = this.ideaService.deleteIdea(item.id); break;
        case 'proposals': obs = this.projectSubmissionService.deleteSubmission(item.id); break;
        case 'contact': obs = this.contactService.deleteMessage(item.id); break;
        case 'project1':
        case 'project2': obs = this.projectSubmissionService.deleteSubmission(item.id); break;
      }

      obs?.subscribe(() => {
        this.dashboardService.addActivity({ type: this.getActivityType(), description: `تم حذف ${this.getTranslatedType()}: ${item.title || item.teamName}`, user: 'أدمن النظام' });
        this.initView();
      });
    }
  }

  onStatusToggle(item: any) {
    let obs: Observable<any> | undefined;
    switch (this.type) {
      case 'news': obs = this.newsService.toggleVisibility(item.id); break;
      case 'event': obs = this.eventService.toggleVisibility(item.id); break;
      case 'template': obs = this.templateService.toggleVisibility(item.id); break;
      case 'ideas': obs = this.ideaService.toggleVisibility(item.id); break;
      case 'proposals': 
      case 'contact': 
      case 'project1': 
      case 'project2': 
        const statuses = ['New', 'Pending', 'Reviewed', 'Accepted', 'Rejected'];
        const currentIdx = statuses.indexOf(item.status);
        const nextStatus: any = statuses[(currentIdx + 1) % statuses.length];
        
        if (this.type === 'proposals') obs = this.proposalService.updateProposalStatus(item.id, nextStatus);
        else if (this.type === 'contact') obs = this.contactService.updateMessageStatus(item.id, nextStatus);
        else obs = this.projectSubmissionService.updateStatus(item.id, nextStatus);
        break;
    }
    obs?.subscribe(() => this.initView());
  }

  private getActivityType(): any {
    switch(this.type) {
      case 'news': return 'News';
      case 'ideas': return 'Idea';
      case 'proposals': return 'Proposal';
      case 'contact': return 'Contact';
      case 'project1':
      case 'project2': return 'Project';
      default: return 'News';
    }
  }

  private getTranslatedType(): string {
    switch(this.type) {
      case 'news': return 'خبر';
      case 'event': return 'فعالية';
      case 'template': return 'نموذج';
      case 'ideas': return 'مشروع';
      case 'proposals': return 'مقترح';
      case 'contact': return 'رسالة';
      case 'project1': return 'مشروع 1';
      case 'project2': return 'مشروع 2';
      default: return 'عنصر';
    }
  }
}
