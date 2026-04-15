import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-management-table',
  templateUrl: './management-table.component.html',
  styleUrls: ['./management-table.component.scss']
})
export class ManagementTableComponent {
  @Input() title: string = '';
  @Input() items: any[] = [];
  @Input() columns: { key: string, label: string }[] = [];
  @Input() showStatus: boolean = true;
  @Input() showAddButton: boolean = true;
  /** When true, status switch uses idea `status === 'Open'` instead of `isVisible`. */
  @Input() ideaOpenClosedToggle = false;
  /** Show bulk PDF/Excel report buttons (idea registrations approved report). */
  @Input() showReportButtons = false;

  /** When report buttons are shown: limit exports to submissions in this calendar year, or all if null. */
  selectedReportYear: number | null = null;

  @Output() delete = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() add = new EventEmitter<void>();
  @Output() toggleStatus = new EventEmitter<any>();
  /** Emits selected year filter (null = all years). */
  @Output() exportPdf = new EventEmitter<number | null>();
  /** Emits selected year filter (null = all years). */
  @Output() exportExcel = new EventEmitter<number | null>();

  /** Years for the report filter dropdown (includes years present in data + recent range). */
  get reportYearChoices(): number[] {
    const current = new Date().getFullYear();
    const set = new Set<number>();
    for (let y = current; y >= current - 15; y--) set.add(y);
    (this.items || []).forEach((i) => {
      const d = i?.submissionDate;
      if (d) {
        const y = new Date(d).getFullYear();
        if (!isNaN(y)) set.add(y);
      }
    });
    return Array.from(set).sort((a, b) => b - a);
  }

  onDelete(item: any) {
    this.delete.emit(item);
  }

  onEdit(item: any) {
    this.edit.emit(item);
  }

  onAdd() {
    this.add.emit();
  }
}
