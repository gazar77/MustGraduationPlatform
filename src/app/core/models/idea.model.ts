export interface Idea {
    id: number;
    title: string;
    description: string;
    category: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    requiredSkills: string[];
    maxTeamSize: number;
    supervisorDoctorId?: number;
    supervisorName: string;
    createdAt: Date;
    status: 'Open' | 'Reserved' | 'Approved' | 'Closed';
    isVisible: boolean;
    order?: number;
}

export type ProjectCategory =
    | 'تطوير مواقع ويب'
    | 'تطوير تطبيقات موبايل'
    | 'الذكاء الاصطناعي'
    | 'تعلم الآلة'
    | 'الرؤية الحاسوبية'
    | 'الأمن السيبراني'
    | 'الشبكات والحوسبة السحابية'
    | 'تحليل البيانات'
    | 'إنترنت الأشياء'
    | 'معالجة اللغة الطبيعية';
