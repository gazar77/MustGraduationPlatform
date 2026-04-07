import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

export type ModalFieldType = 'text' | 'textarea' | 'select' | 'date' | 'readonly' | 'image' | 'pdf' | 'word';

@Component({
  selector: 'app-management-modal',
  templateUrl: './management-modal.component.html',
  styleUrls: ['./management-modal.component.scss']
})
export class ManagementModalComponent implements OnChanges {
  @Input() title: string = '';
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Record<string, unknown>>();

  formData: Record<string, unknown> = {};
  /** Selected files for `image` / `pdf` / `word` field names */
  fileMap: Record<string, File | null> = {};

  @Input() fields: {
    name: string;
    label: string;
    type: ModalFieldType;
    options?: string[];
    value?: unknown;
    accept?: string;
  }[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isOpen && this.fields?.length) {
      this.formData = {};
      this.fileMap = {};
      this.fields.forEach(f => {
        if (f.type === 'image' || f.type === 'pdf' || f.type === 'word') {
          this.fileMap[f.name] = null;
          this.formData[f.name] = '';
        } else {
          this.formData[f.name] = f.value ?? '';
        }
      });
    } else if (!this.isOpen) {
      this.formData = {};
      this.fileMap = {};
    }
  }

  onFileChange(fieldName: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.fileMap[fieldName] = file;
  }

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    const payload: Record<string, unknown> = { ...this.formData };
    Object.keys(this.fileMap).forEach(k => {
      const f = this.fileMap[k];
      if (f) payload[k] = f;
    });
    this.save.emit(payload);
    this.formData = {};
    this.fileMap = {};
  }
}
