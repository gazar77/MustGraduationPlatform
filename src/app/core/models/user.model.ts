export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Student' | 'Admin';
    departmentCode?: string | null;
}

export interface AuthResponse {
    user: User;
    token: string;
}
