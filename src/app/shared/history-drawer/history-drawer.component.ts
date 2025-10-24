import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-history-drawer',
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    MatChipsModule
  ],
  templateUrl: './history-drawer.component.html',
  styleUrl: './history-drawer.component.scss'
})
export class HistoryDrawerComponent implements OnInit {
  @Input() history: any[] = [];

  ngOnInit(): void {}

  getActionIcon(action: string): string {
    switch (action) {
      case 'create': return 'add_circle';
      case 'update': return 'edit';
      case 'delete': return 'delete';
      default: return 'history';
    }
  }

  getActionColor(action: string): string {
    switch (action) {
      case 'create': return 'primary';
      case 'update': return 'accent';
      case 'delete': return 'warn';
      default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  }

  getChangeSummary(change: any): string {
    const data = change.changeData || change.oldData;
    if (!data) return 'No data';

    const keys = Object.keys(data).filter(k =>
      !['id', 'createdAt', 'updatedAt', 'created_at', 'updated_at', 'approvalStatus', 'approval_status', 'requestedBy'].includes(k)
    );

    if (change.action === 'create') {
      return `Created with ${keys.length} field${keys.length > 1 ? 's' : ''}`;
    } else if (change.action === 'delete') {
      return `Deleted entity`;
    } else if (change.action === 'update') {
      const changedFields = keys.filter(k =>
        change.oldData && change.oldData[k] !== data[k]
      );
      return `Updated ${changedFields.length} field${changedFields.length > 1 ? 's' : ''}: ${changedFields.slice(0, 3).join(', ')}${changedFields.length > 3 ? '...' : ''}`;
    }
    return '';
  }

  getChangedFields(change: any): any[] {
    if (change.action === 'delete' || !change.changeData) {
      return [];
    }

    const fields: any[] = [];
    const data = change.changeData;
    const oldData = change.oldData || {};

    Object.keys(data).forEach(key => {
      if (!['id', 'createdAt', 'updatedAt', 'created_at', 'updated_at', 'approvalStatus', 'approval_status', 'requestedBy'].includes(key)) {
        if (change.action === 'create' || oldData[key] !== data[key]) {
          fields.push({
            field: key,
            oldValue: oldData[key] || '-',
            newValue: data[key]
          });
        }
      }
    });

    return fields;
  }
}
