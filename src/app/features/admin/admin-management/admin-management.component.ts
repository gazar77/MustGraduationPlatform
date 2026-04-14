import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../../../core/services/news.service';
import { EventService } from '../../../core/services/event.service';
import { TemplateService } from '../../../core/services/template.service';
import { TutorialDocumentService } from '../../../core/services/tutorial-document.service';
import { IdeaService } from '../../../core/services/idea.service';
import { ContactService } from '../../../core/services/contact.service';
import { ProjectSubmissionService } from '../../../core/services/project-submission.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { IdeaCategoryService } from '../../../core/services/idea-category.service';
import { environment } from '../../../../environments/environment';
import { of, Observable } from 'rxjs';
import { LanguageService } from '../../../core/services/language.service';
import html2canvas from 'html2canvas';

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
    private tutorialDocumentService: TutorialDocumentService,
    private ideaService: IdeaService,
    private contactService: ContactService,
    private projectSubmissionService: ProjectSubmissionService,
    private dashboardService: DashboardService,
    private ideaCategoryService: IdeaCategoryService,
    private langService: LanguageService
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
      case 'ideaRegistrations':
        this.title = 'إدارة استمارات تسجيل المشاريع';
        this.columns = [
          { key: 'projectTitle', label: 'عنوان المشروع' },
          { key: 'teamLeaderName', label: 'قائد الفريق' },
          { key: 'supervisorName', label: 'المشرف' },
          { key: 'submissionDate', label: 'التاريخ' },
          { key: 'status', label: 'الحالة' }
        ];
        this.projectSubmissionService.getSubmissions('idea_registration').subscribe(res => this.items = res);
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
          { key: 'attachmentCount', label: 'عدد الملفات' },
          { key: 'fileName', label: 'ملخص الملفات' },
          { key: 'status', label: 'الحالة' }
        ];
        this.projectSubmissionService.getSubmissions('project1').subscribe((res) => {
          this.items = res.map((r) => ({
            ...r,
            attachmentCount:
              r.attachments?.length ?? (r.fileName && r.fileName !== '-' ? 1 : 0)
          }));
        });
        break;
      case 'project2':
        this.title = 'إدارة تسليمات المشروع 2';
        this.columns = [
          { key: 'projectNumber', label: 'رقم المشروع' },
          { key: 'projectTitle', label: 'اسم المشروع' },
          { key: 'teamLeaderName', label: 'قائد الفريق' },
          { key: 'attachmentCount', label: 'عدد الملفات' },
          { key: 'fileName', label: 'ملخص الملفات' },
          { key: 'status', label: 'الحالة' }
        ];
        this.projectSubmissionService.getSubmissions('project2').subscribe((res) => {
          this.items = res.map((r) => ({
            ...r,
            attachmentCount:
              r.attachments?.length ?? (r.fileName && r.fileName !== '-' ? 1 : 0)
          }));
        });
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
      case 'tutorialDocs':
        this.title = 'إدارة الدروس التعليمية';
        this.columns = [
          { key: 'title', label: 'العنوان' },
          { key: 'fileSize', label: 'الحجم' },
          { key: 'lastUpdate', label: 'تحديث' }
        ];
        this.tutorialDocumentService.getAllForManage().subscribe(res => this.items = res);
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
    this.showTableStatus = ['news', 'event', 'template', 'tutorialDocs', 'ideas'].includes(this.type);
    this.showAddButton = !['proposals', 'ideaRegistrations', 'contact', 'project1', 'project2'].includes(this.type);
  }

  get ideaOpenClosedToggle(): boolean {
    return this.type === 'ideas';
  }

  get showIdeaRegistrationPdfDownload(): boolean {
    return this.modalConfig.isOpen && this.type === 'ideaRegistrations' && !!this.editingItem?.registrationPayloadJson;
  }

  get showProjectFileDownload(): boolean {
    if (!this.modalConfig.isOpen || !this.editingItem) return false;
    const atts = this.editingItem.attachments as Array<{ fileName: string; fileUrl: string }> | undefined;
    if (Array.isArray(atts) && atts.length > 0) {
      return this.type === 'project1' || this.type === 'project2' || this.type === 'proposals';
    }
    const fn = this.editingItem.fileName;
    const url = this.editingItem.fileUrl;
    if (!fn || fn === '-' || !url) return false;
    return (
      this.type === 'project1' ||
      this.type === 'project2' ||
      this.type === 'proposals'
    );
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
    } else if (this.type === 'tutorialDocs') {
      const tutorialAccept =
        '.pdf,.ppt,.pptx,.doc,.docx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      this.modalConfig.title = isEdit ? 'تعديل درس تعليمي' : 'إضافة درس تعليمي';
      this.modalConfig.fields = isEdit
        ? [
            { name: 'title', label: 'العنوان', type: 'text', value: item?.title },
            { name: 'description', label: 'الوصف', type: 'textarea', value: item?.description },
            { name: 'fileSize', label: 'حجم الملف الحالي', type: 'readonly', value: item?.fileSize },
            {
              name: 'tutorialFile',
              label: 'ملف جديد (PDF / PowerPoint / Word) — اختياري',
              type: 'word',
              value: null,
              accept: tutorialAccept
            }
          ]
        : [
            { name: 'title', label: 'العنوان', type: 'text', value: item?.title },
            { name: 'description', label: 'الوصف', type: 'textarea', value: item?.description },
            {
              name: 'tutorialFile',
              label: 'ملف (PDF / PowerPoint / Word)',
              type: 'word',
              value: null,
              accept: tutorialAccept
            }
          ];
    } else if (this.type === 'ideas') {
      this.modalConfig.title = isEdit ? 'تعديل فكرة مشروع' : 'إضافة فكرة مشروع جديدة';
      const catOpts = this.ideaCategoryOptions.length ? this.ideaCategoryOptions : ['—'];
      const skillsJoined =
        Array.isArray(item?.requiredSkills) && item.requiredSkills.length
          ? item.requiredSkills.join(', ')
          : '';
      this.modalConfig.fields = [
        { name: 'title', label: 'عنوان المشروع', type: 'text', value: item?.title },
        { name: 'category', label: 'التصنيف', type: 'select', options: catOpts, value: item?.category },
        { name: 'description', label: 'الوصف', type: 'textarea', value: item?.description },
        {
          name: 'requiredSkillsText',
          label: 'المهارات المطلوبة (افصل بينها بفواصل أو أسطر)',
          type: 'textarea',
          value: skillsJoined
        },
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
    } else if (this.type === 'ideaRegistrations') {
      this.modalConfig.title = 'تفاصيل استمارة تسجيل المشروع';
      this.modalConfig.fields = [
        { name: 'projectNumber', label: 'رقم المشروع', type: 'readonly', value: item?.projectNumber },
        { name: 'projectTitle', label: 'عنوان المشروع', type: 'readonly', value: item?.projectTitle },
        { name: 'teamLeaderName', label: 'قائد الفريق', type: 'readonly', value: item?.teamLeaderName },
        { name: 'supervisorName', label: 'المشرف', type: 'readonly', value: item?.supervisorName },
        { name: 'studentName', label: 'اسم الطالب (المسجل)', type: 'readonly', value: item?.studentName },
        { name: 'email', label: 'البريد', type: 'readonly', value: item?.email },
        { name: 'fileName', label: 'المرفق', type: 'readonly', value: item?.fileName },
        { name: 'notes', label: 'ملاحظات', type: 'readonly', value: item?.notes },
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
      const attCount = Array.isArray(item?.attachments)
        ? item.attachments.length
        : item?.fileName && item?.fileName !== '-'
          ? 1
          : 0;
      this.modalConfig.title = 'تفاصيل التسليم';
      this.modalConfig.fields = [
        { name: 'projectNumber', label: 'رقم المشروع', type: 'readonly', value: item?.projectNumber },
        { name: 'projectTitle', label: 'اسم المشروع', type: 'readonly', value: item?.projectTitle },
        { name: 'teamLeaderName', label: 'اسم قائد الفريق', type: 'readonly', value: item?.teamLeaderName },
        { name: 'supervisorName', label: 'المشرف المتابع', type: 'readonly', value: item?.supervisorName },
        { name: 'attachmentCount', label: 'عدد الملفات المرفوعة', type: 'readonly', value: attCount },
        { name: 'fileName', label: 'ملخص أسماء الملفات', type: 'readonly', value: item?.fileName },
        { name: 'notes', label: 'الملاحظات الإضافية', type: 'readonly', value: item?.notes },
        { name: 'status', label: 'تقييم التسليم', type: 'select', options: ['Pending', 'Reviewed', 'Accepted', 'Rejected'], value: item?.status || 'Pending' }
      ];
    }
  }

  /** Comma or newline separated skills from the ideas modal textarea. */
  private parseRequiredSkillsText(raw: unknown): string[] {
    if (raw == null || typeof raw !== 'string') {
      return [];
    }
    return raw
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
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
      case 'tutorialDocs': {
        const tf = data.tutorialFile;
        if (tf instanceof File) {
          obs = this.tutorialDocumentService.addTutorialWithFile(tf, {
            title: data.title,
            description: String(data.description ?? ''),
            isVisible: true,
            displayOrder: 0
          });
        } else {
          obs = this.tutorialDocumentService.addTutorial({
            title: data.title,
            description: String(data.description ?? ''),
            fileUrl: '#',
            fileSize: '—',
            isVisible: true,
            displayOrder: 0
          });
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
          requiredSkills: this.parseRequiredSkillsText(data.requiredSkillsText),
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
      case 'tutorialDocs': {
        const f = data.tutorialFile;
        if (f instanceof File) {
          obs = this.tutorialDocumentService.updateTutorialWithFile(this.editingItem.id, f, {
            title: data.title,
            description: String(data.description ?? ''),
            isVisible: this.editingItem.isVisible ?? true,
            displayOrder: this.editingItem.order ?? 0
          });
        } else {
          obs = this.tutorialDocumentService.updateTutorial(this.editingItem.id, {
            title: data.title,
            description: data.description,
            fileUrl: this.editingItem.fileUrl,
            fileSize: this.editingItem.fileSize,
            isVisible: this.editingItem.isVisible,
            displayOrder: this.editingItem.order ?? 0
          });
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
          requiredSkills: this.parseRequiredSkillsText(data.requiredSkillsText),
          maxTeamSize: item.maxTeamSize ?? 4,
          supervisorDoctorId: item.supervisorDoctorId ?? null,
          isVisible: item.isVisible,
          displayOrder: item.order ?? 0
        } as any);
        break;
      }
      case 'proposals':
      case 'ideaRegistrations':
        obs = this.projectSubmissionService.updateStatus(this.editingItem.id, data.status);
        break;
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
        case 'tutorialDocs': obs = this.tutorialDocumentService.deleteTutorial(item.id); break;
        case 'ideas': obs = this.ideaService.deleteIdea(item.id); break;
        case 'proposals':
        case 'ideaRegistrations':
          obs = this.projectSubmissionService.deleteSubmission(item.id);
          break;
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
      case 'tutorialDocs': obs = this.tutorialDocumentService.toggleVisibility(item.id); break;
      case 'ideas': obs = this.ideaService.toggleVisibility(item.id); break;
    }
    obs?.subscribe(() => this.initView());
  }

  private getActivityType(): string {
    switch (this.type) {
      case 'news': return 'News';
      case 'event': return 'Event';
      case 'template': return 'Template';
      case 'tutorialDocs': return 'Tutorial';
      case 'ideas': return 'Idea';
      case 'proposals': return 'Proposal';
      case 'ideaRegistrations': return 'IdeaRegistration';
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
      case 'tutorialDocs': return 'درس تعليمي';
      case 'ideas': return 'مشروع';
      case 'proposals': return 'مقترح';
      case 'ideaRegistrations': return 'استمارة تسجيل';
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

    const t = (key: string) => this.langService.translate(key);
    const host = typeof window !== 'undefined' ? window.location.origin : '';
    const logoSrc = `${host}/assets/must-colored-logo.png`;
    const dir = document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr';
    const lang = document.documentElement.lang || 'ar';

    const students = (data['students'] as Array<Record<string, string>>) || [];
    const studentRows = students
      .map(
        (s, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><input type="text" readonly value="${this.escapeAttr(String(s['studentName'] ?? ''))}" /></td>
        <td><input type="text" readonly value="${this.escapeAttr(String(s['universityId'] ?? ''))}" /></td>
        <td><input type="text" readonly value="${this.escapeAttr(String(s['mobileNumber'] ?? ''))}" /></td>
      </tr>`
      )
      .join('');

    const html = `
<div class="document-wrapper page-wrapper" style="min-height:auto;padding:0;margin:0;background:#fff;">
  <div class="paper must-pdf-paper" dir="${dir}" lang="${lang}">
    <div class="header-bar header-bar--top" role="presentation"></div>
    <header class="header">
      <div class="header-block left-block" dir="ltr" lang="en">
        <div class="en-main">${this.escapeHtml(t('ideas.form.facultyEnLine1'))}</div>
        <div class="en-sub">${this.escapeHtml(t('ideas.form.facultyEnLine2'))}</div>
        <div class="en-faculty">
          <div class="en-faculty-line">${this.escapeHtml(t('ideas.form.facultyCollegesEnLine1'))}</div>
          <div class="en-faculty-line">${this.escapeHtml(t('ideas.form.facultyCollegesEnLine2'))}</div>
        </div>
      </div>
      <div class="logo-block">
        <img crossorigin="anonymous" src="${logoSrc}" alt="MUST" />
      </div>
      <div class="header-block right-block">
        <div class="ar-main" dir="rtl" lang="ar">${this.escapeHtml(t('ideas.form.facultyArLine1'))}</div>
        <div class="ar-sub" dir="rtl" lang="ar">${this.escapeHtml(t('ideas.form.facultyArLine2'))}</div>
        <div class="ar-faculty" dir="rtl" lang="ar">${this.escapeHtml(t('ideas.form.facultyCollegesAr'))}</div>
      </div>
    </header>
    <div class="header-line header-bar--bottom" role="presentation"></div>
    <section class="title-section">
      <h1 class="main-title" dir="rtl" lang="ar">${this.escapeHtml(t('ideas.form.docTitle'))}</h1>
    </section>

    <div class="section-heading">${this.escapeHtml(t('ideas.form.section2'))}</div>
    <section class="fields-section">
      ${this.fieldRowHtml(t('ideas.form.titleAr'), String(data['titleAr'] ?? ''), 'rtl')}
      ${this.fieldRowHtml(t('ideas.form.titleEn'), String(data['titleEn'] ?? ''), 'ltr')}
      ${this.fieldRowHtml(t('ideas.form.category'), String(data['category'] ?? ''))}
      ${this.fieldRowHtml(t('ideas.form.supervisorName'), String(data['supervisorName'] ?? ''))}
      ${this.fieldRowHtml(t('ideas.form.assistantSupervisorName'), String(data['assistantSupervisorName'] ?? ''))}
      ${this.fieldRowHtml(t('ideas.form.externalOrg'), String(data['externalOrg'] ?? ''))}
    </section>

    <div class="section-heading">${this.escapeHtml(t('ideas.form.section3'))}</div>
    <div class="field-row only-label">
      <label>${this.escapeHtml(t('ideas.form.studentNamesHeading'))}</label>
    </div>
    <section class="table-section">
      <table class="idea-pdf-table" dir="${dir}">
        <thead>
          <tr>
            <th class="col-no">${this.escapeHtml(t('ideas.form.colIndex'))}</th>
            <th class="col-name">${this.escapeHtml(t('ideas.form.colStudentName'))}</th>
            <th class="col-id">${this.escapeHtml(t('ideas.form.colUniversityId'))}</th>
            <th class="col-phone">${this.escapeHtml(t('ideas.form.colMobile'))}</th>
          </tr>
        </thead>
        <tbody>${studentRows}</tbody>
      </table>
    </section>

    <section class="signatures">
      <div>${this.escapeHtml(t('ideas.form.sigSupervisor'))}</div>
      <div>${this.escapeHtml(t('ideas.form.sigHeads'))}</div>
      <div>${this.escapeHtml(t('ideas.form.sigViceDean'))}</div>
      <div>${this.escapeHtml(t('ideas.form.sigDean'))}</div>
    </section>
  </div>
</div>`;

    const wrapper = document.createElement('div');
    wrapper.id = 'admin-idea-pdf-export-temp';
    wrapper.style.cssText =
      'position:fixed;left:-9999px;top:0;z-index:-9999;width:794px;pointer-events:none;background:#fff;';
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);

    try {
      const logo = wrapper.querySelector('img');
      if (logo) {
        await logo.decode().catch(() => undefined);
      }
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const paper = wrapper.querySelector('.must-pdf-paper') as HTMLElement | null;
      if (!paper) return;

      const canvas = await html2canvas(paper, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgData = canvas.toDataURL('image/png');
      const cw = canvas.width;
      const ch = canvas.height;
      const aspect = cw / ch;
      let imgW = pageWidth;
      let imgH = imgW / aspect;
      if (imgH > pageHeight) {
        imgH = pageHeight;
        imgW = imgH * aspect;
      }
      const x = (pageWidth - imgW) / 2;
      pdf.addImage(imgData, 'PNG', x, 0, imgW, imgH);
      pdf.save(`idea-registration-${this.editingItem.id}.pdf`);
    } catch (e) {
      console.error(e);
      alert('تعذر إنشاء ملف PDF. حاول مرة أخرى.');
    } finally {
      wrapper.remove();
    }
  }

  private escapeAttr(s: string): string {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;');
  }

  private escapeHtml(s: string): string {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  private fieldRowHtml(label: string, value: string, inputDir?: 'rtl' | 'ltr'): string {
    const dirAttr = inputDir ? ` dir="${inputDir}"` : '';
    return `<div class="field-row">
      <label>${this.escapeHtml(label)}</label>
      <input type="text" readonly value="${this.escapeAttr(value)}"${dirAttr} />
    </div>`;
  }

  openUploadedProjectFile(): void {
    const id = this.editingItem?.id as number | undefined;
    if (!id) return;
    const hasZip =
      this.type === 'project1' ||
      this.type === 'project2' ||
      this.type === 'proposals';
    if (!hasZip) {
      const url = this.resolveUploadUrl(this.editingItem?.fileUrl as string | undefined);
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    this.projectSubmissionService.downloadAllAttachmentsZip(id).subscribe({
      next: (blob) => {
        const u = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = u;
        a.download = `project-submission-${id}.zip`;
        a.click();
        URL.revokeObjectURL(u);
      },
      error: () => alert('تعذر تحميل الملفات. تأكد من صلاحياتك واتصال الخادم.')
    });
  }

  private resolveUploadUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const base = environment.apiUrl.replace(/\/api\/v1\/?$/, '');
    return base + (path.startsWith('/') ? path : '/' + path);
  }
}
