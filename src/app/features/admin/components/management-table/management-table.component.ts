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
  
  @Output() delete = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() add = new EventEmitter<void>();
  @Output() toggleStatus = new EventEmitter<any>();

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
