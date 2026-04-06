import { Component, OnInit } from '@angular/core';
import { UsersService, UserListItem } from '../../../core/services/users.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users: UserListItem[] = [];
  loading = true;
  error: string | null = null;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
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
}
