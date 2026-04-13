import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../../../core/services/news.service';
import { EventService } from '../../../core/services/event.service';
import { TemplateService } from '../../../core/services/template.service';
import { IdeaService } from '../../../core/services/idea.service';
import { ContactService } from '../../../core/services/contact.service';
import { ProjectSubmissionService } from '../../../core/services/project-submission.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { IdeaCategoryService } from '../../../core/services/idea-category.service';
import { environment } from '../../../../environments/environment';
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

  /** Show visibility / idea open toggle column */
  showTableStatus = true;
  showAddButton = true;
  ideaCategoryOptions: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private eventService: EventService,
    private templateService: TemplateService,
    private ideaService: IdeaService,
    private contactService: ContactService,
    private projectSubmissionService: ProjectSubmissionService,
    private dashboardService: DashboardService,
    private ideaCategoryService: IdeaCategoryService
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
        this.title = 'إدارة الأخبار';
        this.columns = [
          { key: 'title', label: 'العنوان' },
          { key: 'publishDate', label: 'التاريخ' },
          { key: 'author', label: 'الناشر' }
        ];
        this.newsService.getAllForManage().subscribe(res => this.items = res);
        break;
      case 'event':
        this.title = 'إدارة الفعاليات';
        this.columns = [
          { key: 'title', label: 'الفعالية' },
          { key: 'date', label: 'التاريخ' },
          { key: 'location', label: 'المكان' }
        ];
        this.eventService.getAllForManage().subscribe(res => this.items = res);
        break;
      case 'template':
        this.title = 'إدارة النماذج والوثائق';
        this.columns = [
          { key: 'title', label: 'الاسم' },
          { key: 'fileSize', label: 'الحجم' },
          { key: 'lastUpdate', label: 'تحديث' }
        ];
        this.templateService.getAllForManage().subscribe(res => this.items = res);
        break;
      case 'ideas':
        this.title = 'إدارة أفكار المشاريع';
        this.columns = [
          { key: 'title', label: 'عنوان المشروع' },
          { key: 'category', label: 'التصنيف' },
          { key: 'supervisorName', label: 'المشرف' },
          { key: 'status', label: 'الحالة' }
        ];
        this.ideaCategoryService.getAllForManage().subscribe(c => {
          this.ideaCategoryOptions = c.map(x => x.name);
        });
        this.ideaService.getAllForManage().subscribe(res => this.items = res);
        break;
    }
    this.showTableStatus = ['news', 'event', 'template', 'ideas'].includes(this.type);
    this.showAddButton = !['proposals', 'contact', 'project1', 'project2', 'news', 'event'].includes(this.type);
  }

  get ideaOpenClosedToggle(): boolean {
    return this.type === 'ideas';
  }

  get showProposalPdfDownload(): boolean {
    return this.modalConfig.isOpen && this.type === 'proposals' && !!this.editingItem?.registrationPayloadJson;
  }

  get showProjectFileDownload(): boolean {
    return this.modalConfig.isOpen && (this.type === 'project1' || this.type === 'project2') &&
      !!this.editingItem?.fileUrl && this.editingItem?.fileName && this.editingItem.fileName !== '-';
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
        { name: 'coverImage', label: isEdit ? 'صورة الخبر (اختياري — لتحديث الصورة)' : 'صورة الخبر', type: 'image', value: null }
      ];
    } else if (this.type === 'event') {
      this.modalConfig.title = isEdit ? 'تعديل فعالية' : 'إضافة فعالية جديدة';
      this.modalConfig.fields = [
        { name: 'title', label: 'الاسم', type: 'text', value: item?.title },
        { name: 'description', label: 'الوصف', type: 'textarea', value: item?.description },
        { name: 'date', label: 'التاريخ', type: 'date', value: item?.date },
        { name: 'location', label: 'المكان', type: 'text', value: item?.location },
        { name: 'coverImage', label: isEdit ? 'صورة الفعالية (اختياري)' : 'صورة الفعالية', type: 'image', value: null }
      ];
    } else if (this.type === 'template') {
      this.modalConfig.title = isEdit ? 'تعديل نموذج' : 'إضافة نموذج جديد';
      this.modalConfig.fields = isEdit
        ? [
            { name: 'title', label: 'الاسم', type: 'text', value: item?.title },
            { name: 'description', label: 'الوصف', type: 'textarea', value: item?.description },
            { name: 'fileSize', label: 'حجم الملف الحالي', type: 'readonly', value: item?.fileSize },
            { name: 'wordFile', label: 'ملف Word جديد (اختياري)', type: 'word', value: null }
          ]
        : [
            { name: 'title', label: 'الاسم', type: 'text', value: item?.title },
            { name: 'description', label: 'الوصف', type: 'textarea', value: item?.description },
            { name: 'wordFile', label: 'ملف Word (.doc أو .docx)', type: 'word', value: null }
          ];
    } else if (this.type === 'ideas') {
      this.modalConfig.title = isEdit ? 'تعديل فكرة مشروع' : 'إضافة فكرة مشروع جديدة';
      const catOpts = this.ideaCategoryOptions.length ? this.ideaCategoryOptions : ['—'];
      this.modalConfig.fields = [
        { name: 'title', label: 'عنوان المشروع', type: 'text', value: item?.title },
        { name: 'category', label: 'التصنيف', type: 'select', options: catOpts, value: item?.category },
        { name: 'description', label: 'الوصف', type: 'textarea', value: item?.description },
        { name: 'supervisorName', label: 'اسم المشرف', type: 'text', value: item?.supervisorName }
      ];
    } else if (this.type === 'proposals') {
      this.modalConfig.title = 'تفاصيل وتحديث المقترح';
      this.modalConfig.fields = [
        { name: 'projectNumber', label: 'رقم المشروع', type: 'readonly', value: item?.projectNumber },
        { name: 'projectTitle', label: 'عنوان المشروع', type: 'readonly', value: item?.projectTitle },
        { name: 'teamLeaderName', label: 'الاسم الأول لقائد الفريق', type: 'readonly', value: item?.teamLeaderName },
        { name: 'supervisorName', label: 'المشرف', type: 'readonly', value: item?.supervisorName },
        { name: 'fileName', label: 'الملف المرفق', type: 'readonly', value: item?.fileName },
        { name: 'notes', label: 'ملاحظات الإرسال', type: 'readonly', value: item?.notes },
        { name: 'status', label: 'الحالة', type: 'select', options: ['Pending', 'Reviewed', 'Approved', 'Rejected'], value: item?.status || 'Pending' }
      ];
    } else if (this.type === 'contact') {
      this.modalConfig.title = 'تفاصيل رسالة التواصل';
      this.modalConfig.fields = [
        { name: 'name', label: 'اسم المرسل', type: 'readonly', value: item?.name },
        { name: 'email', label: 'البريد الإلكتروني', type: 'readonly', value: item?.email },
        { name: 'subject', label: 'الموضوع', type: 'readonly', value: item?.subject },
        { name: 'message', label: 'محتوى الرسالة', type: 'readonly', value: item?.message },
        { name: 'status', label: 'حالة الرد', type: 'select', options: ['Pending', 'Reviewed', 'Accepted', 'Rejected'], value: item?.status || 'Pending' }
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
        { name: 'status', label: 'تقييم التسليم', type: 'select', options: ['Pending', 'Reviewed', 'Accepted', 'Rejected'], value: item?.status || 'Pending' }
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
      case 'news': {
        const img = data.coverImage;
        if (img instanceof File) {
          const fd = new FormData();
          fd.append('Title', data.title);
          fd.append('Content', String(data.content ?? ''));
          fd.append('Author', 'أدمن النظام');
          fd.append('Category', 'Announcement');
          fd.append('IsVisible', 'true');
          fd.append('DisplayOrder', '0');
          fd.append('Image', img, img.name);
          obs = this.newsService.addNewsWithImage(fd);
        } else {
          obs = this.newsService.addNews({
            id: 0,
            title: data.title,
            content: data.content,
            author: 'أدمن النظام',
            category: 'Announcement',
            isVisible: true,
            publishDate: new Date(),
            order: 0,
            displayOrder: 0
          } as any);
        }
        break;
      }
      case 'event': {
        const img = data.coverImage;
        if (img instanceof File) {
          const fd = new FormData();
          fd.append('Title', data.title);
          fd.append('Description', String(data.description ?? ''));
          fd.append('Date', String(data.date));
          fd.append('Time', '');
          fd.append('Location', data.location);
          fd.append('Organizer', '');
          fd.append('Category', '');
          fd.append('IsVisible', 'true');
          fd.append('DisplayOrder', '0');
          fd.append('Image', img, img.name);
          obs = this.eventService.addEventWithImage(fd);
        } else {
          obs = this.eventService.addEvent({
            id: 0,
            title: data.title,
            description: data.description,
            date: data.date,
            location: data.location,
            category: '',
            isVisible: true,
            order: 0,
            displayOrder: 0
          } as any);
        }
        break;
      }
      case 'template': {
        const pdf = data.wordFile;
        if (pdf instanceof File) {
          obs = this.templateService.addTemplateWithFile(pdf, {
            title: data.title,
            description: data.description ?? '',
            isVisible: true,
            displayOrder: 0
          });
        } else {
          obs = this.templateService.addTemplate({
            id: 0,
            title: data.title,
            description: data.description,
            fileUrl: '#',
            fileSize: '—',
            lastUpdate: new Date(),
            isVisible: true,
            order: 0,
            displayOrder: 0
          } as any);
        }
        break;
      }
      case 'ideas': {
        obs = this.ideaService.addIdea({
          title: data.title,
          description: data.description,
          category: data.category,
          supervisorName: data.supervisorName,
          status: 'Open',
          difficulty: 'Medium',
          requiredSkills: [],
          maxTeamSize: 4,
          isVisible: true,
          displayOrder: 0
        } as any);
        break;
      }
    }

    obs?.subscribe(() => {
      this.dashboardService.addActivity({
        type: this.getActivityType(),
        description: `تم إضافة ${this.getTranslatedType()} جديد: ${data.title || data.teamName}`,
        user: 'أدمن النظام'
      }).subscribe();
      this.initView();
      this.modalConfig.isOpen = false;
    });
  }

  private performUpdate(data: any) {
    let obs: Observable<any> | undefined;
    switch (this.type) {
      case 'news': {
        const img = data.coverImage;
        if (img instanceof File) {
          const fd = new FormData();
          fd.append('Title', data.title);
          fd.append('Content', String(data.content ?? ''));
          fd.append('Author', String(data.author ?? this.editingItem.author));
          fd.append('Category', this.editingItem.category || 'Announcement');
          fd.append('IsVisible', String(this.editingItem.isVisible ?? true));
          fd.append('DisplayOrder', String(this.editingItem.order ?? 0));
          fd.append('Image', img, img.name);
          obs = this.newsService.updateNewsWithImage(this.editingItem.id, fd);
        } else {
          obs = this.newsService.updateNews(this.editingItem.id, {
            title: data.title,
            content: data.content,
            author: data.author ?? this.editingItem.author,
            category: this.editingItem.category || 'Announcement',
            isVisible: this.editingItem.isVisible,
            order: this.editingItem.order,
            displayOrder: this.editingItem.order
          } as any);
        }
        break;
      }
      case 'event': {
        const img = data.coverImage;
        if (img instanceof File) {
          const fd = new FormData();
          fd.append('Title', data.title);
          fd.append('Description', String(data.description ?? ''));
          fd.append('Date', String(data.date));
          fd.append('Time', this.editingItem.time ?? '');
          fd.append('Location', data.location);
          fd.append('Organizer', this.editingItem.organizer ?? '');
          fd.append('Category', this.editingItem.category ?? '');
          fd.append('IsVisible', String(this.editingItem.isVisible ?? true));
          fd.append('DisplayOrder', String(this.editingItem.order ?? 0));
          fd.append('Image', img, img.name);
          obs = this.eventService.updateEventWithImage(this.editingItem.id, fd);
        } else {
          obs = this.eventService.updateEvent(this.editingItem.id, {
            title: data.title,
            description: data.description,
            date: data.date,
            location: data.location,
            category: this.editingItem.category ?? '',
            time: this.editingItem.time,
            organizer: this.editingItem.organizer,
            image: this.editingItem.image,
            isVisible: this.editingItem.isVisible,
            order: this.editingItem.order,
            displayOrder: this.editingItem.order
          } as any);
        }
        break;
      }
      case 'template': {
        const pdf = data.wordFile;
        if (pdf instanceof File) {
          obs = this.templateService.updateTemplateWithFile(this.editingItem.id, pdf, {
            title: data.title,
            description: data.description ?? '',
            isVisible: this.editingItem.isVisible ?? true,
            displayOrder: this.editingItem.order ?? 0
          });
        } else {
          obs = this.templateService.updateTemplate(this.editingItem.id, {
            title: data.title,
            description: data.description,
            fileUrl: this.editingItem.fileUrl,
            fileSize: this.editingItem.fileSize,
            isVisible: this.editingItem.isVisible,
            order: this.editingItem.order,
            displayOrder: this.editingItem.order
          } as any);
        }
        break;
      }
      case 'ideas': {
        const item = this.editingItem;
        obs = this.ideaService.updateIdea(item.id, {
          title: data.title,
          description: data.description,
          category: data.category,
          supervisorName: data.supervisorName,
          status: item.status,
          difficulty: item.difficulty ?? 'Medium',
          requiredSkills: Array.isArray(item.requiredSkills) ? item.requiredSkills : [],
          maxTeamSize: item.maxTeamSize ?? 4,
          supervisorDoctorId: item.supervisorDoctorId ?? null,
          isVisible: item.isVisible,
          displayOrder: item.order ?? 0
        } as any);
        break;
      }
      case 'proposals': obs = this.projectSubmissionService.updateStatus(this.editingItem.id, data.status); break;
      case 'contact': obs = this.contactService.updateMessageStatus(this.editingItem.id, data.status); break;
      case 'project1':
      case 'project2': obs = this.projectSubmissionService.updateStatus(this.editingItem.id, data.status); break;
    }

    obs?.subscribe(() => {
      this.dashboardService.addActivity({
        type: this.getActivityType(),
        description: `تم تحديث ${this.getTranslatedType()}: ${data.title || data.teamName}`,
        user: 'أدمن النظام'
      }).subscribe();
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
        this.dashboardService.addActivity({
          type: this.getActivityType(),
          description: `تم حذف ${this.getTranslatedType()}: ${item.title || item.teamName}`,
          user: 'أدمن النظام'
        }).subscribe();
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
    }
    obs?.subscribe(() => this.initView());
  }

  private getActivityType(): string {
    switch (this.type) {
      case 'news': return 'News';
      case 'event': return 'Event';
      case 'template': return 'Template';
      case 'ideas': return 'Idea';
      case 'proposals': return 'Proposal';
      case 'contact': return 'Contact';
      case 'project1':
      case 'project2': return 'Project';
      default: return 'News';
    }
  }

  private getTranslatedType(): string {
    switch (this.type) {
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

  async downloadIdeaRegistrationPdf(): Promise<void> {
    const raw = this.editingItem?.registrationPayloadJson as string | undefined;
    if (!raw) return;
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return;
    }
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();
    let y = 14;
    const add = (text: string) => {
      pdf.text(text, 10, y);
      y += 7;
    };
    add('Graduation Project Registration');
    y += 4;
    add(`Academic year: ${String(data['academicYear'] ?? '')}`);
    add(`Semester: ${String(data['semester'] ?? '')}`);
    add(`Department: ${String(data['department'] ?? '')}`);
    add(`Title (EN): ${String(data['titleEn'] ?? '')}`);
    add(`Title (AR): ${String(data['titleAr'] ?? '')}`);
    add(`Category: ${String(data['category'] ?? '')}`);
    add(`Supervisor: ${String(data['supervisorName'] ?? '')}`);
    add(`Assistant supervisor: ${String(data['assistantSupervisorName'] ?? '')}`);
    add(`External org: ${String(data['externalOrg'] ?? '')}`);
    y += 4;
    add('Students:');
    const students = (data['students'] as Array<Record<string, string>>) || [];
    students.forEach((s, i) => {
      add(`${i + 1}. ${s['studentName'] ?? ''} — ID: ${s['universityId'] ?? ''} — ${s['mobileNumber'] ?? ''}`);
    });
    pdf.save(`idea-registration-${this.editingItem.id}.pdf`);
  }

  openUploadedProjectFile(): void {
    const url = this.resolveUploadUrl(this.editingItem?.fileUrl as string | undefined);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  private resolveUploadUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const base = environment.apiUrl.replace(/\/api\/v1\/?$/, '');
    return base + (path.startsWith('/') ? path : '/' + path);
  }
}
