import { Component, OnInit } from '@angular/core';
import { DoctorDashboardService, DoctorDashboard } from '../../../core/services/doctor-dashboard.service';
import { Idea } from '../../../core/models/idea.model';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.scss'
})
export class DoctorDashboardComponent implements OnInit {
  loading = true;
  error = '';
  dashboard: DoctorDashboard | null = null;

  constructor(private doctorApi: DoctorDashboardService) {}

  ngOnInit(): void {
    this.doctorApi.getDashboard().subscribe({
      next: (d) => {
        this.dashboard = d;
        this.loading = false;
      },
      error: () => {
        this.error = 'تعذر تحميل لوحة الدكتور.';
        this.loading = false;
      }
    });
  }

  trackById(_: number, idea: Idea): number {
    return idea.id;
  }
}
