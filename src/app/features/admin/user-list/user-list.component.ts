import { Component, OnInit } from '@angular/core';
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

  editUser(u: UserListItem): void {
    if (!this.isSuperAdmin) return;
    const name = prompt('الاسم الكامل', u.name);
    if (name === null) return;
    const roleIn = prompt('الدور: Admin أو Student', u.role);
    if (roleIn === null) return;
    const role = roleIn.trim();
    if (role !== 'Admin' && role !== 'Student') {
      alert('الدور يجب أن يكون Admin أو Student');
      return;
    }
    this.usersService.updateUser(u.id, { fullName: name.trim(), role }).subscribe({
      next: () => this.load(),
      error: () => alert('فشل التحديث')
    });
  }

  deleteUser(u: UserListItem): void {
    if (!this.canDelete(u)) return;
    if (!confirm('تأكيد حذف هذا المستخدم؟')) return;
    this.usersService.deleteUser(u.id).subscribe({
      next: () => this.load(),
      error: (err) => {
        const msg = err?.error?.message || 'فشل الحذف';
        alert(msg);
      }
    });
  }
}
