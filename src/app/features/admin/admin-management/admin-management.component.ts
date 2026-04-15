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
import ExcelJS from 'exceljs';

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
  /** Bulk approved report (PDF/Excel) on idea registrations list */
  showReportButtons = false;
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
    this.showReportButtons = this.type === 'ideaRegistrations';
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
      const templateAccept =
        '.ppt,.pptx,.doc,.docx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      this.modalConfig.title = isEdit ? 'تعديل نموذج' : 'إضافة نموذج جديد';
      this.modalConfig.fields = isEdit
        ? [
            { name: 'title', label: 'الاسم', type: 'text', value: item?.title },
            { name: 'description', label: 'الوصف', type: 'textarea', value: item?.description },
            { name: 'fileSize', label: 'حجم الملف الحالي', type: 'readonly', value: item?.fileSize },
            {
              name: 'wordFile',
              label: 'ملف جديد (Word أو PowerPoint — اختياري)',
              type: 'word',
              value: null,
              accept: templateAccept
            }
          ]
        : [
            { name: 'title', label: 'الاسم', type: 'text', value: item?.title },
            { name: 'description', label: 'الوصف', type: 'textarea', value: item?.description },
            {
              name: 'wordFile',
              label: 'ملف Word أو PowerPoint (.doc، .docx، .ppt، .pptx)',
              type: 'word',
              value: null,
              accept: templateAccept
            }
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

  private parseProjectBlocks(approved: any[]): Array<{ idx: number; data: Record<string, unknown>; students: Array<Record<string, string>> }> {
    const blocks: Array<{ idx: number; data: Record<string, unknown>; students: Array<Record<string, string>> }> = [];
    let idx = 1;
    for (const item of approved) {
      let data: Record<string, unknown>;
      try {
        data = JSON.parse(item.registrationPayloadJson as string) as Record<string, unknown>;
      } catch {
        continue;
      }
      const students = (data['students'] as Array<Record<string, string>>) || [];
      blocks.push({ idx, data, students });
      idx++;
    }
    return blocks;
  }

  private buildGraduationProjectsReportHtml(
    projects: Array<{ idx: number; data: Record<string, unknown>; students: Array<Record<string, string>> }>,
    year: number | null
  ): string {
    const esc = (s: string) => this.escapeHtml(s);
    const yearLabel = year != null ? String(year) : 'All Years';

    let bodyRows = '';
    projects.forEach((project, index) => {
      const { data, students } = project;
      const rowCount = students.length || 1;
      const supervisor = esc(String(data['supervisorName'] ?? ''));
      const coSupervisor = esc(String(data['assistantSupervisorName'] ?? ''));
      const projectName = esc(String(data['titleEn'] ?? data['titleAr'] ?? ''));

      for (let i = 0; i < rowCount; i++) {
        const s = students[i];
        const isFirst = i === 0;
        const rs = ` rowspan="${rowCount}"`;
        let row = '<tr>';
        if (isFirst) {
          row += `<td${rowCount > 1 ? rs : ''} class="c-merged">${project.idx}</td>`;
          row += `<td${rowCount > 1 ? rs : ''} class="c-merged">${supervisor}</td>`;
          row += `<td${rowCount > 1 ? rs : ''} class="c-merged c-cosup">${coSupervisor}</td>`;
          row += `<td${rowCount > 1 ? rs : ''} class="c-merged">${projectName}</td>`;
        }
        row += `<td>${s ? esc(String(s['universityId'] ?? '')) : ''}</td>`;
        row += `<td>${s ? esc(String(s['studentName'] ?? '')) : ''}</td>`;
        if (isFirst) {
          row += `<td${rowCount > 1 ? rs : ''} class="c-merged">${students.length}</td>`;
        }
        row += '</tr>';
        bodyRows += row;
      }

      if (index !== projects.length - 1) {
        bodyRows += '<tr class="spacer-row"><td colspan="7"></td></tr>';
      }
    });

    return `
<div class="admin-graduation-report">
  <style>
    .admin-graduation-report {
      font-family: Arial, Helvetica, sans-serif;
      background: #fff;
      color: #000;
      padding: 0;
      margin: 0;
    }
    .admin-graduation-report .report-title {
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      padding: 8px 0;
      border: 1px solid #000;
    }
    .admin-graduation-report .report-subtitle {
      text-align: center;
      font-size: 14px;
      font-weight: bold;
      padding: 6px 0;
      border: 1px solid #000;
      border-top: none;
    }
    .admin-graduation-report .spacer { height: 6px; }
    .admin-graduation-report table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }
    .admin-graduation-report th,
    .admin-graduation-report td {
      border: 1px solid #000;
      text-align: center;
      vertical-align: middle;
      font-size: 10px;
      font-weight: bold;
      padding: 4px 3px;
      word-wrap: break-word;
    }
    .admin-graduation-report th {
      background: #f2f2f2;
      font-size: 11px;
      padding: 6px 3px;
    }
    .admin-graduation-report .c-cosup {
      word-wrap: break-word;
      overflow-wrap: break-word;
      line-height: 1.4;
      min-height: 30px;
    }
    .admin-graduation-report col.c-pno    { width: 5.3%; }
    .admin-graduation-report col.c-sup    { width: 16%; }
    .admin-graduation-report col.c-cosup-col { width: 16%; }
    .admin-graduation-report col.c-proj   { width: 25.3%; }
    .admin-graduation-report col.c-id     { width: 10%; }
    .admin-graduation-report col.c-name   { width: 18.7%; }
    .admin-graduation-report col.c-cnt    { width: 8.7%; }
    .admin-graduation-report .spacer-row td {
      border: none;
      height: 6px;
      padding: 0;
    }
  </style>
  <div class="report-title">Graduation Projects Report &mdash; ${esc(yearLabel)}</div>
  <div class="report-subtitle">CS/IS/AI 498</div>
  <div class="spacer"></div>
  <table>
    <colgroup>
      <col class="c-pno"><col class="c-sup"><col class="c-cosup-col"><col class="c-proj">
      <col class="c-id"><col class="c-name"><col class="c-cnt">
    </colgroup>
    <thead>
      <tr>
        <th>P. No.</th>
        <th>Supervisor Name</th>
        <th>Co. Supervisor<br>Name</th>
        <th>Project Name</th>
        <th>ID</th>
        <th>Student Name</th>
        <th>Students<br>Count</th>
      </tr>
    </thead>
    <tbody>
      ${bodyRows}
    </tbody>
  </table>
</div>`;
  }

  private async captureReportHtml(html: string, wrapperWidth: number): Promise<HTMLCanvasElement | null> {
    const wrapper = document.createElement('div');
    wrapper.id = 'admin-report-pdf-temp';
    wrapper.style.cssText =
      `position:fixed;left:-9999px;top:0;z-index:-9999;width:${wrapperWidth}px;pointer-events:none;background:#fff;`;
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      const target = wrapper.querySelector('.admin-graduation-report') as HTMLElement | null;
      if (!target) return null;
      return await html2canvas(target, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
    } finally {
      wrapper.remove();
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
    const students = (data['students'] as Array<Record<string, string>>) || [];
    const projects = [{ idx: 1, data, students }];
    const html = this.buildGraduationProjectsReportHtml(projects, null);
    try {
      const canvas = await this.captureReportHtml(html, 1123);
      if (!canvas) {
        alert('تعذر إنشاء ملف PDF. حاول مرة أخرى.');
        return;
      }
      await this.canvasToPdfPages(canvas, `idea-registration-${this.editingItem.id}.pdf`);
    } catch (e) {
      console.error(e);
      alert('تعذر إنشاء ملف PDF. حاول مرة أخرى.');
    }
  }

  exportApprovedReport(format: 'pdf' | 'excel', year: number | null = null): void {
    if (this.type !== 'ideaRegistrations') return;
    const approved = this.items.filter(
      (i) => i.status === 'Approved' && i.registrationPayloadJson
    );
    const filtered = this.filterApprovedBySubmissionYear(approved, year);
    if (filtered.length === 0) {
      alert(
        year == null
          ? 'لا توجد استمارات بحالة معتمد للتصدير.'
          : 'لا توجد استمارات معتمدة في السنة المحددة للتصدير.'
      );
      return;
    }
    if (format === 'pdf') {
      void this.exportApprovedIdeaRegistrationsPdf(filtered, year);
    } else {
      void this.exportApprovedIdeaRegistrationsExcel(filtered, year);
    }
  }

  private filterApprovedBySubmissionYear(items: any[], year: number | null): any[] {
    if (year == null) return items;
    return items.filter((i) => {
      const d = i?.submissionDate;
      if (!d) return false;
      return new Date(d).getFullYear() === year;
    });
  }

  private reportFileSuffix(year: number | null): string {
    return year == null ? 'all' : String(year);
  }

  private async canvasToPdfPages(canvas: HTMLCanvasElement, fileName: string): Promise<void> {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    const imgW = pageW;
    const scale = imgW / canvas.width;
    const totalImgH = canvas.height * scale;

    if (totalImgH <= pageH) {
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgW, totalImgH);
    } else {
      const pageHeightPx = pageH / scale;
      const totalPages = Math.ceil(canvas.height / pageHeightPx);
      for (let p = 0; p < totalPages; p++) {
        if (p > 0) pdf.addPage();
        const srcY = p * pageHeightPx;
        const srcH = Math.min(pageHeightPx, canvas.height - srcY);
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = srcH;
        const ctx = sliceCanvas.getContext('2d')!;
        ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
        const sliceData = sliceCanvas.toDataURL('image/png');
        const sliceH = srcH * scale;
        pdf.addImage(sliceData, 'PNG', 0, 0, imgW, sliceH);
      }
    }

    pdf.save(fileName);
  }

  private async exportApprovedIdeaRegistrationsPdf(approved: any[], year: number | null): Promise<void> {
    const projects = this.parseProjectBlocks(approved);
    if (projects.length === 0) {
      alert('تعذر إنشاء ملف PDF.');
      return;
    }
    const html = this.buildGraduationProjectsReportHtml(projects, year);
    try {
      const canvas = await this.captureReportHtml(html, 1123);
      if (!canvas) {
        alert('تعذر إنشاء ملف PDF.');
        return;
      }
      await this.canvasToPdfPages(canvas, `approved-idea-registrations-${this.reportFileSuffix(year)}.pdf`);
    } catch (e) {
      console.error(e);
      alert('تعذر إنشاء ملف PDF. حاول مرة أخرى.');
    }
  }

  private excelBorderAll(): Partial<ExcelJS.Borders> {
    const c = { argb: 'FF000000' };
    return {
      top: { style: 'thin', color: c },
      left: { style: 'thin', color: c },
      bottom: { style: 'thin', color: c },
      right: { style: 'thin', color: c }
    };
  }

  private excelSetStyledCell(cell: ExcelJS.Cell, value: string | number, bold = false): void {
    cell.value = value;
    cell.font = { name: 'Arial', size: 10, bold };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = this.excelBorderAll();
  }

  private async exportApprovedIdeaRegistrationsExcel(approved: any[], year: number | null): Promise<void> {
    const projects = this.parseProjectBlocks(approved);
    if (projects.length === 0) {
      alert('لا توجد بيانات صالحة للتصدير.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Must Graduation Platform';
    workbook.created = new Date();

    const ws = workbook.addWorksheet('Graduation Projects', {
      views: [{ showGridLines: true }]
    });

    ws.pageSetup = {
      paperSize: 9,
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0
    };

    ws.columns = [
      { key: 'pno', width: 8 },
      { key: 'supervisor', width: 24 },
      { key: 'coSupervisor', width: 24 },
      { key: 'project', width: 38 },
      { key: 'id', width: 15 },
      { key: 'student', width: 28 },
      { key: 'count', width: 13 }
    ];

    const border = () => this.excelBorderAll();

    const yearLabel = year != null ? String(year) : 'All Years';
    ws.mergeCells('A1:G1');
    const title1 = ws.getCell('A1');
    title1.value = `Graduation Projects Report — ${yearLabel}`;
    title1.font = { name: 'Arial', size: 16, bold: true };
    title1.alignment = { horizontal: 'center', vertical: 'middle' };
    title1.border = border();

    ws.mergeCells('A2:G2');
    const title2 = ws.getCell('A2');
    title2.value = 'CS/IS/AI 498';
    title2.font = { name: 'Arial', size: 14, bold: true };
    title2.alignment = { horizontal: 'center', vertical: 'middle' };
    title2.border = border();

    ws.getRow(1).height = 28;
    ws.getRow(2).height = 24;
    ws.getRow(3).height = 10;

    const headerRowIndex = 4;
    const headers = [
      'P. No.',
      'Supervisor Name',
      'Co. Supervisor\nName',
      'Project Name',
      'ID',
      'Student Name',
      'Students\nCount'
    ];

    headers.forEach((text, i) => {
      const cell = ws.getCell(headerRowIndex, i + 1);
      cell.value = text;
      cell.font = { name: 'Arial', size: 11, bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = border();
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
    });
    ws.getRow(headerRowIndex).height = 32;

    const CHARS_PER_LINE = 20;
    const LINE_HEIGHT_PT = 15;

    let currentRow = 5;

    projects.forEach((project, index) => {
      const { data, students } = project;
      const studentCount = students.length || 1;
      const startRow = currentRow;
      const endRow = currentRow + studentCount - 1;

      if (startRow !== endRow) {
        ws.mergeCells(`A${startRow}:A${endRow}`);
        ws.mergeCells(`B${startRow}:B${endRow}`);
        ws.mergeCells(`C${startRow}:C${endRow}`);
        ws.mergeCells(`D${startRow}:D${endRow}`);
        ws.mergeCells(`G${startRow}:G${endRow}`);
      }

      this.excelSetStyledCell(ws.getCell(`A${startRow}`), project.idx, true);
      this.excelSetStyledCell(ws.getCell(`B${startRow}`), String(data['supervisorName'] ?? ''), true);
      this.excelSetStyledCell(ws.getCell(`D${startRow}`), String(data['titleEn'] ?? data['titleAr'] ?? ''), true);
      this.excelSetStyledCell(ws.getCell(`G${startRow}`), students.length, true);

      const coSupText = String(data['assistantSupervisorName'] ?? '');
      this.excelSetStyledCell(ws.getCell(`C${startRow}`), coSupText, true);

      if (students.length === 0) {
        ws.getCell(`E${startRow}`).border = border();
        ws.getCell(`F${startRow}`).border = border();
      } else {
        students.forEach((s, i) => {
          const rowNum = startRow + i;
          const idCell = ws.getCell(`E${rowNum}`);
          idCell.value = String(s['universityId'] ?? '');
          idCell.font = { name: 'Arial', size: 10, bold: true };
          idCell.alignment = { horizontal: 'center', vertical: 'middle' };
          idCell.border = border();

          const nameCell = ws.getCell(`F${rowNum}`);
          nameCell.value = String(s['studentName'] ?? '');
          nameCell.font = { name: 'Arial', size: 10, bold: true };
          nameCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
          nameCell.border = border();
        });
      }

      const estimatedLines = Math.min(3, Math.max(2, Math.ceil(coSupText.length / CHARS_PER_LINE)));
      const minBlockHeight = estimatedLines * LINE_HEIGHT_PT;
      const defaultRowH = 24;
      const totalDefaultH = studentCount * defaultRowH;

      for (let r = startRow; r <= endRow; r++) {
        const rowH = totalDefaultH < minBlockHeight
          ? Math.max(defaultRowH, Math.ceil(minBlockHeight / studentCount))
          : defaultRowH;
        ws.getRow(r).height = rowH;
        ['A', 'B', 'C', 'D', 'G'].forEach((col) => {
          const cell = ws.getCell(`${col}${r}`);
          cell.border = border();
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        });
      }

      currentRow = endRow + 1;

      if (index !== projects.length - 1) {
        ws.getRow(currentRow).height = 10;
        currentRow += 1;
      }
    });

    ws.eachRow((row) => {
      row.eachCell((cell) => {
        if (!cell.font) {
          cell.font = { name: 'Arial', size: 10 };
        }
      });
    });

    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `approved-idea-registrations-${this.reportFileSuffix(year)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('تعذر إنشاء ملف Excel. حاول مرة أخرى.');
    }
  }

  private escapeHtml(s: string): string {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
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
