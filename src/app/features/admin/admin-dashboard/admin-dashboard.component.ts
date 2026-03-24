import { Component, OnInit } from '@angular/core';
import { AuthMockService } from '../../../core/services/auth-mock.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { User } from '../../../core/models/user.model';
import { DashboardStats, Activity } from '../../../core/models/dashboard-stats.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;
  today = new Date();
  stats$: Observable<DashboardStats>;
  activities$: Observable<Activity[]>;

  constructor(
    private authService: AuthMockService,
    private dashboardService: DashboardService
  ) {
    this.stats$ = this.dashboardService.getStats();
    this.activities$ = this.dashboardService.getRecentActivities();
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
}
