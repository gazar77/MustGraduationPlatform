import { Component, OnInit } from '@angular/core';
import { ModalFieldType } from '../../../shared/components/management-modal/management-modal.component';
import { UsersService, UserListItem } from '../../../core/services/users.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users: UserListItem[] = [];
  loading = true;
  error: string | null = null;

  editModalOpen = false;
  saveError: string | null = null;
  editingUser: UserListItem | null = null;
  editModalFields: {
    name: string;
    label: string;
    type: ModalFieldType;
    options?: string[];
    value?: unknown;
  }[] = [];

  deleteConfirmUser: UserListItem | null = null;
  deleteError: string | null = null;
  deleteLoading = false;

  constructor(
    private usersService: UsersService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'تعذر تحميل قائمة المستخدمين.';
        this.loading = false;
      }
    });
  }

  get isSuperAdmin(): boolean {
    return this.authService.currentUserValue?.role === 'SuperAdmin';
  }

  get isAdmin(): boolean {
    const r = this.authService.currentUserValue?.role;
    return r === 'Admin' || r === 'SuperAdmin';
  }

  canDelete(u: UserListItem): boolean {
    if (u.role === 'SuperAdmin') return false;
    if (this.isSuperAdmin) return u.role === 'Student' || u.role === 'Admin';
    return u.role === 'Student';
  }

  canEdit(u: UserListItem): boolean {
    return this.isSuperAdmin && u.role !== 'SuperAdmin';
  }

  openEditModal(u: UserListItem): void {
    if (!this.canEdit(u)) return;
    this.editingUser = u;
    this.saveError = null;
    this.editModalOpen = true;
    const roleValue = u.role === 'Admin' || u.role === 'Student' ? u.role : 'Student';
    this.editModalFields = [
      { name: 'fullName', label: 'الاسم الكامل', type: 'text', value: u.name },
      { name: 'role', label: 'الدور', type: 'select', options: ['Admin', 'Student'], value: roleValue },
      { name: 'email', label: 'البريد الإلكتروني', type: 'readonly', value: u.email }
    ];
  }

  closeEditModal(): void {
    this.editModalOpen = false;
    this.editingUser = null;
    this.saveError = null;
  }

  onEditSave(payload: Record<string, unknown>): void {
    if (!this.editingUser) return;
    const role = String(payload['role'] ?? '').trim();
    const fullName = String(payload['fullName'] ?? '').trim();
    if (role !== 'Admin' && role !== 'Student') {
      this.saveError = 'الدور يجب أن يكون Admin أو Student.';
      return;
    }
    this.saveError = null;
    this.usersService.updateUser(this.editingUser.id, { fullName, role }).subscribe({
      next: () => {
        this.closeEditModal();
        this.load();
      },
      error: (err) => {
        this.saveError = err?.error?.message || 'فشل التحديث.';
      }
    });
  }

  requestDelete(u: UserListItem): void {
    if (!this.canDelete(u)) return;
    this.deleteConfirmUser = u;
    this.deleteError = null;
  }

  cancelDelete(): void {
    this.deleteConfirmUser = null;
    this.deleteError = null;
  }

  confirmDelete(): void {
    const u = this.deleteConfirmUser;
    if (!u) return;
    this.deleteLoading = true;
    this.deleteError = null;
    this.usersService.deleteUser(u.id).subscribe({
      next: () => {
        this.deleteLoading = false;
        this.deleteConfirmUser = null;
        this.load();
      },
      error: (err) => {
        this.deleteLoading = false;
        this.deleteError = err?.error?.message || 'فشل الحذف.';
      }
    });
  }
}
