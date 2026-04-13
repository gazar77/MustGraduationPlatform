import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = new BehaviorSubject<'ar' | 'en'>(this.getInitialLang());
  currentLang$ = this.currentLang.asObservable();

  private translations: any = {
    en: {
      nav: {
        portal: 'Portal',
        portalServices: 'Portal Services',
        university: 'The University',
        academics: 'Academics',
        admission: 'Admission',
        buzz: 'MUST BUZZ',
        centers: 'Centers',
        life: 'Life at MUST',
        sdgs: 'SDGs',
        home: 'Home',
        ideas: 'Projects Ideas',
        register: 'Register Idea',
        registration1: 'Project Registration 1',
        registration2: 'Project Registration 2',
        graduation: 'Graduation Form',
        gradForm: 'Start Form',
        gradReq1: 'Project Submission 1',
        gradReq2: 'Project Submission 2',
        requirements1: 'Project Submission 1',
        requirements2: 'Project Submission 2',
        submissions: 'Submissions',
        submitProposal: 'Submit Proposal',
        submitReg1: 'Project Submission 1',
        submitReg2: 'Project Submission 2',
        templates: 'Templates',
        news: 'News',
        events: 'Events',
        req1: 'Project Submission 1',
        req2: 'Project Submission 2',
        buzzEvents: 'MUST Events',
        buzzNews: 'MUST News',
        buzzBlogs: 'MUST Blogs',
        buzzAnnouncements: 'Announcements',
        importantLinks: 'Important Links',
        contact: 'Contact Us',
        doctor: 'Doctor Panel',
        admin: 'Admin Panel',
        controlPanel: 'Control panel',
        logout: 'Logout',
        signUp: 'Register',
        login: 'Login',
        ideaRegister: 'Idea Register',
        submission: 'Submission',
        resources: 'Resources',
        tutorials: 'Tutorials',
        proposalMenu: 'Proposal'
      },
      footer: {
        links: 'Links',
        about: 'About University',
        buzz: 'MUST BUZZ',
        contact: 'Contact Info',
        address: 'Al-Motamayez District, 6th of October City, Egypt',
        phone: '+20 2 38247414',
        hotline: 'Hotline 16878',
        email: 'info@must.edu.eg',
        research: 'Research & Centres',
        maps: 'Maps & Directions',
        faqs: 'FAQs',
        history: 'History',
        partnerships: 'Accreditation And Partnership',
        why: 'Why MUST',
        values: 'Values & Principles',
        privacy: 'Privacy Policy',
        blog: 'Blog',
        copyright: 'Copyright All Right Reserved @ MUST UNIVERSITY 2025'
      },
      dashboard: {
        heroTitle: 'Graduation Projects Platform',
        stats: {
          ideas: 'Available Project Ideas',
          reserved: 'Reserved Projects',
          approved: 'Approved Projects',
          doctors: 'Faculty Members'
        },
        services: 'Portal Services',
        serviceCards: {
          ideas: 'Projects Ideas',
          register: 'Register Idea',
          submission: 'Submit Proposal',
          req1: 'Project Submission 1',
          req2: 'Project Submission 2',
          templates: 'Templates',
          news: 'News',
          events: 'Events',
          contact: 'Contact Us'
        },
        newsTitle: 'Latest News & Announcements',
        viewAll: 'View All News',
        deadlineTitle: 'Upcoming Deadlines',
        quickLinksTitle: 'Quick Links',
        forms: {
          submitIdea: 'Submit Idea Form',
          downloadTemplates: 'Template Library'
        }
      },
      ideas: {
        title: 'Browse Graduation Projects Ideas',
        subtitle: 'Explore ideas proposed by faculty members',
        searchPlaceholder: 'Search for project ideas...',
        filters: {
          allCategories: 'All Categories',
          allStatuses: 'All Statuses',
          available: 'Available',
          reserved: 'Reserved',
          approved: 'Approved'
        },
        noResults: 'No results matching your search.',
        card: {
          supervisor: 'Supervisor:',
          difficultyLabel: 'Difficulty:',
          viewDetails: 'View Details',
          team: 'Team:',
          students: 'Students'
        },
        status: {
          Open: 'Open',
          Reserved: 'Reserved',
          Approved: 'Approved',
          Closed: 'Closed'
        },
        difficulty: {
          Easy: 'Easy',
          Medium: 'Medium',
          Hard: 'Hard'
        },
        register: {
          title: 'Register Graduation Project Idea',
          projectTitle: 'Project Title',
          projectTitlePlaceholder: 'Enter project title',
          category: 'Project Domain',
          selectCategory: 'Select Domain',
          categories: {
            AI: 'Artificial Intelligence',
            Web: 'Web Development',
            Mobile: 'Mobile Apps',
            Cyber: 'Cyber Security'
          },
          description: 'Project Description',
          descriptionPlaceholder: 'Write a brief description...',
          leaderName: 'Team Leader Name',
          leaderId: 'University ID',
          submitBtn: 'Submit Request',
          successMsg: 'Project idea registered successfully!',
          exportPdf: 'Download PDF',
          exportWord: 'Download Word',
          exportBusy: 'Please wait…',
          exportHint: 'Save a copy of this form'
        },
        detail: {
          reserveBtn: 'Reserve this idea',
          masterClosed: 'Closed',
          reserveSuccess: 'The idea has been reserved successfully.',
          reserveFailed: 'Could not reserve this idea. Sign in as a student, or reservations may be closed.'
        }
      },
      submission: {
        proposal: {
          title: 'Submit Graduation Project Proposal',
          subtitle: 'Please fill in all requested data accurately to ensure the proposal is reviewed',
          statusOpen: 'Open Now',
          statusClosing: 'Closing Soon',
          statusClosed: 'Closed',
          deadlineDate: 'Deadline:',
          daysRemaining: 'Remaining',
          days: 'days',
          closingIn: 'until closing',
          basicInfo: 'Basic Project Information',
          projectName: 'Project Name',
          projectNamePlaceholder: 'Enter the proposed project name',
          teamName: 'Team Name',
          teamNamePlaceholder: 'Example: Innovation Team',
          teamMembers: 'Team Members Names',
          teamMembersPlaceholder: 'Write the names of participating students separated by commas',
          department: 'Department',
          selectDepartment: 'Select Department',
          departments: {
            CS: 'Computer Science',
            IS: 'Information Systems',
            AI: 'Artificial Intelligence',
            IT: 'Information Technology'
          },
          proposedSupervisor: 'Proposed Supervisor',
          supervisorPlaceholder: 'Name of the supervising doctor',
          technicalDetails: 'Technical Details & Goals',
          idea: 'Project Idea',
          ideaPlaceholder: 'Explain the project idea in detail (at least 50 characters)',
          goals: 'Project Goals',
          goalsPlaceholder: 'What does the project aim to achieve?',
          description: 'Brief Description',
          descriptionPlaceholder: 'Brief summary for presentation',
          tools: 'Tools or Technologies Used',
          toolsPlaceholder: 'Example: Angular, Python, TensorFlow',
          attachments: 'Attachments & Notes',
          uploadTitle: 'Upload Proposal File (PDF)',
          uploadSubtitle: 'Drag and drop the file here or click to select',
          fileSelected: 'File Selected:',
          additionalNotes: 'Additional Notes',
          notesPlaceholder: 'Any notes you would like to add for the review committee',
          saveDraft: 'Save as Draft',
          submitFinal: 'Submit Final Proposal',
          successMsg: 'Proposal submitted successfully!'
        },
        registration: {
          reg1Title: 'Project Registration 1',
          reg1Instructions: 'Please upload the required documents for the first phase, including transcripts and supervisor approval.',
          reg2Title: 'Project Registration 2',
          reg2Instructions: 'Please upload progress reports for the second phase and final requirements.',
          deadline: 'Deadline for Submission',
          dragFile: 'Drag the file here to upload',
          supportedFiles: 'PDF, Word, PowerPoint (.ppt/.pptx), images, ZIP/RAR/7Z — max 25 MB',
          additionalNotes: 'Additional Notes (Optional)',
          notesPlaceholder: 'Write any notes you want to attach with the documents...',
          cancel: 'Cancel',
          submitDocs: 'Submit Documents',
          successMsg: 'Documents submitted successfully for phase: ',
          tips: {
            verifyTitle: 'Verify Data',
            verifyText: 'Review attached files carefully before sending.',
            privacyTitle: 'Strict Privacy',
            privacyText: 'All attached files are encrypted.',
            helpTitle: 'Need Help?',
            helpText: 'Contact college technical support.'
          }
        }
      },
      news: {
        list: {
          title: 'Discussions Schedule & Updates',
          subtitle: 'Follow the latest official deadlines and announcements for the department',
          addNewsBtn: 'Add New Announcement',
          authorPrefix: 'By:',
          detailsBtn: 'View Details',
          emptyTitle: 'No announcements currently',
          emptyText: 'Please check back later for the latest updates.',
          prompts: {
            newTitle: 'Enter new schedule/announcement title:',
            newContent: 'Enter announcement details:'
          },
          category: {
            Announcement: 'Announcement',
            Event: 'Event',
            Reminder: 'Reminder'
          }
        }
      },
      events: {
        list: {
          title: 'Graduation Projects Events',
          subtitle: 'Follow the latest conferences, workshops, and graduation project discussions in the Faculty of Computers and Information.',
          detailsBtn: 'Details',
          addEventBtn: 'Add event',
          category: {
            academic: 'Academic',
            social: 'Social',
            workshop: 'Workshop',
            competition: 'Competition'
          },
          prompts: {
            newTitle: 'Enter new event title:',
            newDesc: 'Enter event description:'
          },
          defaultTime: '10:00 AM - 12:00 PM',
          defaultLoc: 'Faculty'
        },
        details: {
          descriptionTitle: 'Event Description',
          organizer: 'Organizer:',
          defaultOrganizer: 'Faculty of Information Technology',
          registerBtn: 'Register Attendance Now',
          shareBtn: 'Share',
          scheduleTitle: 'Event Schedule',
          timeLabel: 'Time',
          locationLabel: 'Location',
          notesTitle: 'Important Notes',
          note1: 'Please arrive 15 minutes early.',
          note2: 'Bringing University ID is mandatory for entry.',
          note3: 'Adhere to official dress code for graduation project students.',
          errorTitle: 'Sorry, Event Not Found',
          backBtn: 'Back to Events'
        }
      },
      templates: {
        title: 'Templates & Models Library',
        subtitle: 'Download guide files and required templates for your graduation project.',
        lastUpdate: 'Last updated: ',
        downloadBtn: 'Download',
        downloadWord: 'Download Word',
        prompts: {
          newTitle: 'Enter new template title:',
          newDesc: 'Enter template description:'
        }
      },
      tutorials: {
        title: 'Tutorials',
        placeholder: 'Tutorial materials and guides will appear here.'
      },
      contact: {
        title: 'Contact Us',
        subtitle: 'We are here to help. Contact us for any inquiries regarding graduation projects and stay informed about the events schedule.',
        addressLabel: 'Address',
        addressValue: 'Misr University for Science and Technology, 6th of October City, Egypt',
        phoneLabel: 'Phone (Hotline)',
        emailLabel: 'University Email',
        formTitle: 'Send us your message',
        successMsg: 'Your message has been sent successfully. We will contact you soon.',
        fullName: 'Full Name',
        namePlaceholder: 'Enter your full name',
        nameReq: 'Please enter your name',
        email: 'Email',
        emailPlaceholder: 'example@must.edu.eg',
        emailReq: 'Please enter your email',
        emailInv: 'Invalid email address',
        subject: 'Subject',
        subjectPlaceholder: 'Write your message subject here',
        subjectReq: 'Please enter a subject',
        messageText: 'Message Body',
        messagePlaceholder: 'Message details or inquiry...',
        messageReq: 'Please enter the message body',
        submitBtn: 'Send Message'
      }
    },
    ar: {
      nav: {
        portal: 'بوابة الطالب',
        portalServices: 'خدمات البوابة',
        university: 'الجامعة',
        academics: 'الأكاديميات',
        admission: 'القبول والتسجيل',
        buzz: 'MUST BUZZ',
        centers: 'المراكز',
        life: 'الحياة في MUST',
        sdgs: 'أهداف التنمية المستدامة',
        home: 'الرئيسية',
        ideas: 'أفكار المشاريع',
        register: 'تسجيل فكرة مشروع',
        registration1: 'تسجيل مشروع 1',
        registration2: 'تسجيل مشروع 2',
        graduation: 'استمارة التخرج',
        gradForm: 'ملء الاستمارة',
        gradReq1: 'تسليم مشروع 1',
        gradReq2: 'تسليم مشروع 2',
        requirements1: 'تسليم مشروع 1',
        requirements2: 'تسليم مشروع 2',
        submissions: 'التسليمات',
        submitProposal: 'تسليم المقترح',
        submitReg1: 'تسليم مشروع 1',
        submitReg2: 'تسليم مشروع 2',
        templates: 'النماذج',
        news: 'الأخبار',
        events: 'الفعاليات',
        req1: 'تسليم مشروع 1',
        req2: 'تسليم مشروع 2',
        buzzEvents: 'فعاليات جامعة مصر',
        buzzNews: 'أخبار جامعة مصر',
        buzzBlogs: 'مدونات جامعة مصر',
        buzzAnnouncements: 'الإعلانات',
        importantLinks: 'روابط هامة',
        contact: 'اتصل بنا',
        doctor: 'لوحة الدكتور',
        admin: 'لوحة المدير',
        controlPanel: 'لوحة التحكم',
        logout: 'تسجيل الخروج',
        signUp: 'تسجيل',
        login: 'دخول',
        ideaRegister: 'تسجيل الفكرة',
        submission: 'التسليم',
        resources: 'الموارد',
        tutorials: 'الدروس التعليمية',
        proposalMenu: 'المقترح'
      },
      footer: {
        links: 'روابط هامة',
        importantLinks: 'روابط هامة',
        contact: 'اتصل بنا',
        address: 'حي المتميز، مدينة السادس من أكتوبر، مصر',
        phone: '02 38247414',
        hotline: 'الخط الساخن 16878',
        email: 'info@must.edu.eg',
        research: 'الأبحاث والمراكز',
        maps: 'الخرائط والاتجاهات',
        faqs: 'الأسئلة الشائعة',
        history: 'تاريخ الجامعة',
        partnerships: 'الاعتماد والشراكات',
        why: 'لماذا MUST؟',
        values: 'القيم والمبادئ',
        privacy: 'سياسة الخصوصية',
        blog: 'المدونة',
        copyright: 'جميع الحقوق محفوظة @ جامعة مصر للعلوم والتكنولوجيا 2025'
      },
      dashboard: {
        heroTitle: 'منصة مشروع التخرج',
        stats: {
          ideas: 'أفكار المشاريع المتاحة',
          reserved: 'مشاريع محجوزة',
          approved: 'مشاريع معتمدة',
          doctors: 'أعضاء هيئة التدريس'
        },
        services: 'خدمات البوابة',
        serviceCards: {
          ideas: 'أفكار المشاريع',
          register: 'تسجيل فكرة مشروع',
          submission: 'تقديم المقترح (Proposal)',
          req1: 'تسليم مشروع 1',
          req2: 'تسليم مشروع 2',
          templates: 'النماذج والوثائق',
          news: 'الأخبار والإعلانات',
          events: 'الفعاليات والأحداث',
          contact: 'اتصل بنا'
        },
        newsTitle: 'آخر الأخبار والإعلانات',
        viewAll: 'عرض جميع الأخبار',
        deadlineTitle: 'أقرب مواعيد التسليم',
        quickLinksTitle: 'روابط سريعة',
        forms: {
          submitIdea: 'استمارة تقديم فكرة',
          downloadTemplates: 'مكتبة القوالب'
        }
      },
      ideas: {
        title: 'تصفح أفكار مشاريع التخرج',
        subtitle: 'استعرض الأفكار المقترحة من قبل السادة أعضاء هيئة التدريس',
        searchPlaceholder: 'بحث عن فكرة مشروع...',
        filters: {
          allCategories: 'جميع الفئات',
          allStatuses: 'جميع الحالات',
          available: 'متاح',
          reserved: 'محجوز',
          approved: 'معتمد'
        },
        noResults: 'لا توجد نتائج تطابق بحثك.',
        card: {
          supervisor: 'المشرف:',
          difficultyLabel: 'الصعوبة:',
          viewDetails: 'عرض التفاصيل',
          team: 'فريق:',
          students: 'طلاب'
        },
        status: {
          Open: 'متاح',
          Reserved: 'محجوز جزئياً',
          Approved: 'معتمد',
          Closed: 'مغلق'
        },
        difficulty: {
          Easy: 'سهل',
          Medium: 'متوسط',
          Hard: 'صعب'
        },
        register: {
          title: 'تسجيل فكرة مشروع تخرج',
          projectTitle: 'عنوان المشروع',
          projectTitlePlaceholder: 'أدخل عنوان المشروع',
          category: 'مجال المشروع',
          selectCategory: 'اختر المجال',
          categories: {
            AI: 'ذكاء اصطناعي',
            Web: 'تطوير ويب',
            Mobile: 'تطبيقات موبايل',
            Cyber: 'أمن سيبراني'
          },
          description: 'وصف المشروع',
          descriptionPlaceholder: 'اكتب وصفاً مختصراً للمشروع',
          leaderName: 'اسم قائد الفريق',
          leaderId: 'الرقم الجامعي',
          submitBtn: 'إرسال الطلب',
          successMsg: 'تم تسجيل فكرة المشروع بنجاح!',
          exportPdf: 'تحميل PDF',
          exportWord: 'تحميل Word',
          exportBusy: 'يرجى الانتظار…',
          exportHint: 'احفظ نسخة من هذا النموذج'
        },
        detail: {
          reserveBtn: 'حجز هذه الفكرة',
          masterClosed: 'مغلق',
          reserveSuccess: 'تم حجز الفكرة بنجاح.',
          reserveFailed: 'تعذر حجز الفكرة. قد تحتاج لتسجيل الدخول كطالب، أو أن الحجز مغلق.'
        }
      },
      submission: {
        proposal: {
          title: 'تقديم مقترح مشروع التخرج',
          subtitle: 'يرجى ملء كافة البيانات المطلوبة بدقة لضمان مراجعة المقترح',
          statusOpen: 'متاح الآن',
          statusClosing: 'قارب على الإغلاق',
          statusClosed: 'تم الإغلاق',
          deadlineDate: 'آخر موعد:',
          daysRemaining: 'متبقي',
          days: 'أيام',
          closingIn: 'على الإغلاق',
          basicInfo: 'معلومات المشروع الأساسية',
          projectName: 'اسم المشروع',
          projectNamePlaceholder: 'أدخل اسم المشروع المقترح',
          teamName: 'اسم الفريق',
          teamNamePlaceholder: 'مثال: فريق الابتكار',
          teamMembers: 'أسماء أعضاء الفريق',
          teamMembersPlaceholder: 'اكتب أسماء الطلاب المشاركين مفصولة بفواصل',
          department: 'القسم',
          selectDepartment: 'اختر القسم',
          departments: {
            CS: 'علوم الحاسب',
            IS: 'نظم المعلومات',
            AI: 'الذكاء الاصطناعي',
            IT: 'تكنولوجيا المعلومات'
          },
          proposedSupervisor: 'المشرف المقترح',
          supervisorPlaceholder: 'اسم الدكتور المشرف',
          technicalDetails: 'التفاصيل التقنية والأهداف',
          idea: 'فكرة المشروع',
          ideaPlaceholder: 'اشرح فكرة المشروع بالتفصيل (50 حرف على الأقل)',
          goals: 'أهداف المشروع',
          goalsPlaceholder: 'ما الذي يهدف المشروع لتحقيقه؟',
          description: 'وصف مختصر',
          descriptionPlaceholder: 'نبذة مختصرة للعرض',
          tools: 'الأدوات أو التقنيات المستخدمة',
          toolsPlaceholder: 'مثال: Angular, Python, TensorFlow',
          attachments: 'المرفقات والملاحظات',
          uploadTitle: 'رفع ملف البروبوزال (PDF)',
          uploadSubtitle: 'اسحب الملف هنا أو انقر للاختيار',
          fileSelected: 'تم اختيار:',
          additionalNotes: 'ملاحظات إضافية',
          notesPlaceholder: 'أي ملاحظات تود إضافتها للجنة المراجعه',
          saveDraft: 'حفظ كمسودة',
          submitFinal: 'إرسال المقترح النهائي',
          successMsg: 'تم تقديم المقترح بنجاح!'
        },
        registration: {
          reg1Title: 'تسجيل مشروع 1',
          reg1Instructions: 'يرجى رفع المستندات المطلوبة للمرحلة الأولى من تسجيل المشروع، تشمل كشف الدرجات وموافقة المشرف.',
          reg2Title: 'تسجيل مشروع 2',
          reg2Instructions: 'يرجى رفع تقارير الإنجاز للمرحلة الثانية والمتطلبات النهائية للتسجيل.',
          deadline: 'آخر موعد للتقديم',
          dragFile: 'اسحب الملف هنا لرفعه',
          supportedFiles: 'PDF وWord وPowerPoint، صور، وملفات مضغوطة — بحد أقصى 25 ميجابايت',
          additionalNotes: 'ملاحظات إضافية (اختياري)',
          notesPlaceholder: 'اكتب أي ملاحظات تود إرفاقها مع المستندات...',
          cancel: 'إلغاء',
          submitDocs: 'إرسال المستندات',
          successMsg: 'تم رفع المستندات بنجاح للمرحلة: ',
          tips: {
            verifyTitle: 'تأكد من صحة البيانات',
            verifyText: 'راجع الملفات المرفقة جيداً قبل الإرسال.',
            privacyTitle: 'خصوصية تامة',
            privacyText: 'يتم تشفير كافة الملفات المرفقة.',
            helpTitle: 'تحتاج مساعدة؟',
            helpText: 'تواصل مع الدعم الفني للكلية.'
          }
        }
      },
      news: {
        list: {
          title: 'جدول المناقشات والتحديثات',
          subtitle: 'تابع آخر المواعيد والإعلانات الرسمية للقسم',
          addNewsBtn: 'إضافة إعلان جديد',
          authorPrefix: 'بواسطة:',
          detailsBtn: 'عرض التفاصيل',
          emptyTitle: 'لا توجد إعلانات حالياً',
          emptyText: 'يرجى مراجعة الصفحة لاحقاً لمتابعة آخر التحديثات.',
          prompts: {
            newTitle: 'أدخل عنوان الجدول/الخبر الجديد:',
            newContent: 'أدخل تفاصيل الخبر:'
          },
          category: {
            Announcement: 'إعلان',
            Event: 'فعالية',
            Reminder: 'تذكير'
          }
        }
      },
      events: {
        list: {
          title: 'فعاليات مشاريع التخرج',
          subtitle: 'تابع أحدث المؤتمرات، ورش العمل، ومناقشات مشاريع التخرج في كلية الحاسبات والمعلومات.',
          detailsBtn: 'التفاصيل',
          addEventBtn: 'إضافة فعالية',
          category: {
            academic: 'أكاديمي',
            social: 'اجتماعي',
            workshop: 'ورشة عمل',
            competition: 'مسابقات'
          },
          prompts: {
            newTitle: 'أدخل عنوان الفعالية الجديدة:',
            newDesc: 'أدخل وصف الفعالية:'
          },
          defaultTime: '10:00 ص - 12:00 م',
          defaultLoc: 'الكلية'
        },
        details: {
          descriptionTitle: 'وصف الفعالية',
          organizer: 'الجهة المنظمة:',
          defaultOrganizer: 'كلية تكنولوجيا المعلومات',
          registerBtn: 'تسجيل الحضور الآن',
          shareBtn: 'مشاركة',
          scheduleTitle: 'موعد الفعالية',
          timeLabel: 'الوقت',
          locationLabel: 'الموقع',
          notesTitle: 'ملاحظات هامة',
          note1: 'يرجى الحضور قبل الموعد بـ 15 دقيقة.',
          note2: 'إحضار كارنيه الجامعة شرط أساسي للدخول.',
          note3: 'الالتزام بالزي الرسمي لطلاب مشاريع التخرج.',
          errorTitle: 'عذراً، لم يتم العثور على الفعالية',
          backBtn: 'العودة للفعاليات'
        }
      },
      templates: {
        title: 'مكتبة القوالب والنماذج',
        subtitle: 'قم بتحميل الملفات الإرشادية والقوالب المطلوبة لمشروع تخرجك',
        lastUpdate: 'آخر تحديث: ',
        downloadBtn: 'تحميل',
        downloadWord: 'تحميل Word',
        prompts: {
          newTitle: 'أدخل عنوان النموذج الجديد:',
          newDesc: 'أدخل وصف النموذج:'
        }
      },
      tutorials: {
        title: 'الدروس التعليمية',
        placeholder: 'ستُعرض هنا المواد التعليمية والأدلة.'
      },
      contact: {
        title: 'اتصل بنا',
        subtitle: 'نحن هنا للمساعدة. تواصل معنا لأي استفسار بخصوص مشاريع التخرج بالكلية وكن على تواصل دائم بجدول الفعاليات.',
        addressLabel: 'العنوان',
        addressValue: 'جامعة مصر للعلوم والتكنولوجيا، مدينة 6 أكتوبر، مصر',
        phoneLabel: 'الهاتف (الخط الساخن)',
        emailLabel: 'البريد الإلكتروني للجامعة',
        formTitle: 'أرسل لنا رسالتك',
        successMsg: 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.',
        fullName: 'الاسم الكامل',
        namePlaceholder: 'أدخل اسمك كاملاً',
        nameReq: 'يرجى إدخال الاسم',
        email: 'البريد الإلكتروني',
        emailPlaceholder: 'example@must.edu.eg',
        emailReq: 'يرجى إدخال البريد الإلكتروني',
        emailInv: 'بريد إلكتروني غير صالح',
        subject: 'موضوع الرسالة',
        subjectPlaceholder: 'اكتب موضوع رسالتك هنا',
        subjectReq: 'يرجى إدخال الموضوع',
        messageText: 'نص الرسالة',
        messagePlaceholder: 'تفاصيل الرسالة أو استفسارك...',
        messageReq: 'يرجى إدخال نص الرسالة',
        submitBtn: 'إرسال الرسالة'
      }
    }
  };

  constructor() {
    this.applyLanguage(this.currentLang.value);
  }

  private getInitialLang(): 'ar' | 'en' {
    const savedLang = localStorage.getItem('lang');
    return (savedLang as 'ar' | 'en') || 'en';
  }

  toggleLanguage() {
    const newValue = this.currentLang.value === 'en' ? 'ar' : 'en';
    this.currentLang.next(newValue);
    localStorage.setItem('lang', newValue);
    this.applyLanguage(newValue);
  }

  private applyLanguage(lang: 'ar' | 'en') {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  translate(key: string): string {
    const keys = key.split('.');
    let result = this.translations[this.currentLang.value];
    for (const k of keys) {
      if (result) result = result[k];
    }
    return result || key;
  }
}
