import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { PendingChange } from '../../../core/models/pending-change.model';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-approval-detail-modal',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './approval-detail-modal.component.html',
  styleUrl: './approval-detail-modal.component.scss'
})
export class ApprovalDetailModalComponent {
  rejectionReason: string = '';

  constructor(
    public dialogRef: MatDialogRef<ApprovalDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { change: PendingChange },
    private dialog: MatDialog
  ) {}

  getFieldKeys(): string[] {
    if (this.data.change.action === 'delete') {
      return Object.keys(this.data.change.oldData || {}).filter(key =>
        !['id', 'createdAt', 'updatedAt', 'created_at', 'updated_at', 'approvalStatus', 'approval_status'].includes(key)
      );
    }
    return Object.keys(this.data.change.changeData || {}).filter(key =>
      !['id', 'createdAt', 'updatedAt', 'created_at', 'updated_at', 'approvalStatus', 'approval_status', 'requestedBy'].includes(key)
    );
  }

  getOldValue(key: string): any {
    return this.data.change.oldData?.[key] || '-';
  }

  getNewValue(key: string): any {
    return this.data.change.changeData?.[key] || '-';
  }

  hasChanges(key: string): boolean {
    if (this.data.change.action === 'create') return true;
    if (this.data.change.action === 'delete') return true;
    return this.getOldValue(key) !== this.getNewValue(key);
  }

  approve(): void {
    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirm Approval',
        message: `Are you sure you want to approve this ${this.data.change.action} request for ${this.data.change.entityType}?`,
        confirmText: 'Approve',
        cancelText: 'Cancel'
      }
    });

    confirmDialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.dialogRef.close({ action: 'approve' });
      }
    });
  }

  reject(): void {
    if (!this.rejectionReason.trim()) {
      // Show validation message if no reason provided
      const validationDialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '450px',
        data: {
          title: 'Rejection Reason Required',
          message: 'Please provide a reason for rejecting this change before proceeding.',
          confirmText: 'OK',
          cancelText: ''
        }
      });
      return;
    }

    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirm Rejection',
        message: `Are you sure you want to reject this ${this.data.change.action} request?\n\nReason: ${this.rejectionReason}`,
        confirmText: 'Reject',
        cancelText: 'Cancel'
      }
    });

    confirmDialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.dialogRef.close({ action: 'reject', reason: this.rejectionReason });
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  formatValue(value: any): string {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }
}
