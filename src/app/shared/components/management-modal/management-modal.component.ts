import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-management-modal',
  templateUrl: './management-modal.component.html',
  styleUrls: ['./management-modal.component.scss']
})
export class ManagementModalComponent {
  @Input() title: string = '';
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  formData: any = {};

  // Form structure defined by the parent
  @Input() fields: { name: string, label: string, type: 'text' | 'textarea' | 'select' | 'date' | 'readonly', options?: string[], value?: any }[] = [];

  ngOnChanges(): void {
    if (this.isOpen && this.fields) {
      this.fields.forEach(f => {
        this.formData[f.name] = f.value || '';
      });
    } else if (!this.isOpen) {
      this.formData = {};
    }
  }

  onClose() {
    this.close.emit();
  }

  onSave() {
    this.save.emit(this.formData);
    this.formData = {}; // Reset
  }
}
