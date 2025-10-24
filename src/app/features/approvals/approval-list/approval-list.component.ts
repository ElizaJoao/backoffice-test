import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PendingChange } from '../../../core/models/pending-change.model';
import { ApprovalService } from '../../../core/services/approval.service';
import { ApprovalDetailModalComponent } from '../approval-detail-modal/approval-detail-modal.component';

@Component({
  selector: 'app-approval-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule
  ],
  templateUrl: './approval-list.component.html',
  styleUrl: './approval-list.component.scss'
})
export class ApprovalListComponent implements OnInit {
  displayedColumns: string[] = ['entityType', 'action', 'requestedBy', 'createdAt', 'status', 'preview', 'actions'];
  dataSource!: MatTableDataSource<PendingChange>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private approvalService: ApprovalService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<PendingChange>([]);
  }

  ngOnInit(): void {
    this.loadPendingChanges();
  }

  loadPendingChanges(): void {
    // Load all changes (pending, approved, rejected)
    this.approvalService.getChangeHistory().subscribe(changes => {
      this.dataSource.data = changes;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getEntityIcon(entityType: string): string {
    switch (entityType) {
      case 'user': return 'person';
      case 'company': return 'business';
      default: return 'info';
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

  getPreviewData(change: PendingChange): string {
    if (change.action === 'create') {
      return change.changeData.name || 'New record';
    } else if (change.action === 'update') {
      return `${change.oldData?.name || 'Record'} → ${change.changeData.name || ''}`;
    } else if (change.action === 'delete') {
      return change.oldData?.name || 'Record';
    }
    return '';
  }

  approveChange(change: PendingChange): void {
    // Open detail modal for approval
    this.viewDetails(change);
  }

  rejectChange(change: PendingChange): void {
    // Open detail modal for rejection
    this.viewDetails(change);
  }

  viewDetails(change: PendingChange): void {
    const dialogRef = this.dialog.open(ApprovalDetailModalComponent, {
      width: '800px',
      data: { change }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.action === 'approve') {
          this.approvalService.approveChange(change.id, 'Admin').subscribe(() => {
            this.loadPendingChanges();
          });
        } else if (result.action === 'reject') {
          this.approvalService.rejectChange(change.id, result.reason, 'Admin').subscribe(() => {
            this.loadPendingChanges();
          });
        }
      }
    });
  }
}
