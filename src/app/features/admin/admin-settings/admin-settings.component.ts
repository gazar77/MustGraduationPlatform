import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SiteSettingsService } from '../../../core/services/site-settings.service';
import { IdeaCategoryService, IdeaCategory } from '../../../core/services/idea-category.service';
import { HERO_BANNER_BG_IMAGES_KEY } from '../../../core/constants/hero-banner-settings';

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

  heroImageUrls: string[] = [];
  savingHero = false;
  heroUploadingIndex: number | null = null;

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
        const hero = list.find((s) => s.key === HERO_BANNER_BG_IMAGES_KEY);
        if (hero) {
          const raw = this.siteSettingsService.parseStoredValue(hero.value);
          try {
            const parsed = JSON.parse(raw) as unknown;
            if (
              Array.isArray(parsed) &&
              parsed.length > 0 &&
              parsed.every((x: unknown) => typeof x === 'string')
            ) {
              this.heroImageUrls = [...(parsed as string[])];
            } else {
              this.heroImageUrls = [];
            }
          } catch {
            this.heroImageUrls = [];
          }
        } else {
          this.heroImageUrls = [];
        }

        this.rows = list
          .filter((s) => s.key !== HERO_BANNER_BG_IMAGES_KEY)
          .map((s) => ({
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

  /** Matches server rules for hero paths: /uploads/ or /assets/, no traversal. */
  private isHeroImagePathAllowed(path: string): boolean {
    const p = path.trim();
    if (!p || p.includes('..') || p.includes('\\') || p.includes(':')) {
      return false;
    }
    const lower = p.toLowerCase();
    return lower.startsWith('/uploads/') || lower.startsWith('/assets/');
  }

  private apiErrorMessage(err: unknown, fallback: string): string {
    if (!(err instanceof HttpErrorResponse)) {
      return fallback;
    }
    const body = err.error;
    if (body && typeof body === 'object' && body !== null && 'message' in body) {
      const m = (body as { message?: unknown }).message;
      if (typeof m === 'string' && m.length > 0) {
        return m;
      }
    }
    if (typeof body === 'string' && body.length > 0) {
      return body;
    }
    return fallback;
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

  addHeroImageRow(): void {
    this.heroImageUrls = [...this.heroImageUrls, ''];
  }

  onHeroFileSelected(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    this.heroUploadingIndex = index;
    this.siteSettingsService.uploadHeroBannerImage(file).subscribe({
      next: (res) => {
        const next = [...this.heroImageUrls];
        next[index] = res.url;
        this.heroImageUrls = next;
        this.heroUploadingIndex = null;
        this.message = 'تم رفع الصورة إلى الخادم.';
      },
      error: (err: unknown) => {
        this.heroUploadingIndex = null;
        this.message = this.apiErrorMessage(err, 'فشل رفع الصورة');
      }
    });
  }

  removeHeroImageAt(index: number): void {
    this.heroImageUrls = this.heroImageUrls.filter((_, i) => i !== index);
  }

  moveHeroUp(index: number): void {
    if (index <= 0) return;
    const next = [...this.heroImageUrls];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    this.heroImageUrls = next;
  }

  moveHeroDown(index: number): void {
    if (index >= this.heroImageUrls.length - 1) return;
    const next = [...this.heroImageUrls];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    this.heroImageUrls = next;
  }

  saveHeroImages(): void {
    const urls = this.heroImageUrls.map((s) => s.trim()).filter(Boolean);
    if (urls.length === 0) {
      this.message = 'أضف مساراً واحداً على الأقل للصور.';
      return;
    }
    const invalid = urls.filter((u) => !this.isHeroImagePathAllowed(u));
    if (invalid.length > 0) {
      const sample = invalid.slice(0, 3).join('، ');
      this.message =
        'كل مسار يجب أن يبدأ بـ /uploads/ أو /assets/ دون أحرف غير مسموحة. تحقق من: ' + sample;
      return;
    }
    this.message = null;
    this.savingHero = true;
    const payload = JSON.stringify(urls);
    this.siteSettingsService.upsert(HERO_BANNER_BG_IMAGES_KEY, payload).subscribe({
      next: (res) => {
        this.savingHero = false;
        this.message = 'تم حفظ صور الهيرو';
        try {
          const parsed = JSON.parse(res.value) as unknown;
          if (Array.isArray(parsed) && parsed.every((x: unknown) => typeof x === 'string')) {
            this.heroImageUrls = [...(parsed as string[])];
          }
        } catch {
          /* keep current list */
        }
      },
      error: (err: unknown) => {
        this.savingHero = false;
        this.message = this.apiErrorMessage(err, 'فشل حفظ صور الهيرو');
      }
    });
  }
}

