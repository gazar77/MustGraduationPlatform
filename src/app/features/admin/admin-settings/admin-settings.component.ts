import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
import { IdeaCategoryService, IdeaCategory } from '../../../core/services/idea-category.service';

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

  categories: IdeaCategory[] = [];
  loadingCategories = true;
  newCategoryName = '';
  newCategoryOrder = 0;
  savingCategory = false;

  constructor(
    private siteSettingsService: SiteSettingsService,
    private ideaCategoryService: IdeaCategoryService
  ) {}

  ngOnInit(): void {
    this.load();
    this.loadCategories();
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
      error: (err: unknown) => {
        this.error = this.settingsLoadErrorMessage(err);
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.loadingCategories = true;
    this.ideaCategoryService.getAllForManage().subscribe({
      next: (c) => {
        this.categories = c;
        this.loadingCategories = false;
      },
      error: () => {
        this.loadingCategories = false;
      }
    });
  }

  private settingsLoadErrorMessage(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 404) {
        return 'تعذر تحميل الإعدادات: المسار غير موجود على الخادم (404). تأكد من نشر نسخة API الحديثة.';
      }
      if (err.status === 401 || err.status === 403) {
        return 'تعذر تحميل الإعدادات (يجب أن تكون مسجلاً كمدير).';
      }
    }
    return 'تعذر تحميل الإعدادات. تحقق من الاتصال أو حاول لاحقاً.';
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

  addCategory(): void {
    const name = this.newCategoryName.trim();
    if (!name) return;
    this.savingCategory = true;
    this.ideaCategoryService.create({ name, sortOrder: this.newCategoryOrder }).subscribe({
      next: () => {
        this.newCategoryName = '';
        this.savingCategory = false;
        this.message = 'تمت إضافة التصنيف';
        this.loadCategories();
      },
      error: () => {
        this.savingCategory = false;
        this.message = 'فشل إضافة التصنيف';
      }
    });
  }

  updateCategory(cat: IdeaCategory): void {
    this.ideaCategoryService.update(cat.id, { name: cat.name, sortOrder: cat.sortOrder }).subscribe({
      next: () => {
        this.message = 'تم حفظ التصنيف';
        this.loadCategories();
      },
      error: () => (this.message = 'فشل الحفظ')
    });
  }

  removeCategory(cat: IdeaCategory): void {
    if (!confirm('حذف هذا التصنيف؟')) return;
    this.ideaCategoryService.delete(cat.id).subscribe({
      next: () => {
        this.message = 'تم الحذف';
        this.loadCategories();
      },
      error: () => (this.message = 'فشل الحذف')
    });
  }
}
