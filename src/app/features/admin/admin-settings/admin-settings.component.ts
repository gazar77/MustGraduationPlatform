import { Component, OnInit } from '@angular/core';
import { SiteSettingsService } from '../../../core/services/site-settings.service';

interface SettingRow {
  key: string;
  value: string;
  editValue: string;
  saving: boolean;
}

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.scss'
})
export class AdminSettingsComponent implements OnInit {
  rows: SettingRow[] = [];
  loading = true;
  error: string | null = null;
  message: string | null = null;

  constructor(private siteSettingsService: SiteSettingsService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.siteSettingsService.getAll().subscribe({
      next: (list) => {
        this.rows = list.map((s) => ({
          key: s.key,
          value: s.value,
          editValue: this.siteSettingsService.parseStoredValue(s.value),
          saving: false
        }));
        this.loading = false;
      },
      error: () => {
        this.error = 'تعذر تحميل الإعدادات (يجب أن تكون مسجلاً كمدير).';
        this.loading = false;
      }
    });
  }

  save(row: SettingRow): void {
    this.message = null;
    row.saving = true;
    const payload = row.editValue;
    this.siteSettingsService.upsert(row.key, payload).subscribe({
      next: (res) => {
        row.value = res.value;
        row.editValue = this.siteSettingsService.parseStoredValue(res.value);
        row.saving = false;
        this.message = 'تم حفظ ' + row.key;
      },
      error: () => {
        row.saving = false;
        this.message = 'فشل الحفظ لـ ' + row.key;
      }
    });
  }
}
