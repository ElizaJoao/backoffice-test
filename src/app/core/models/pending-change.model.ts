export interface PendingChange {
  id: number;
  entityType: 'user' | 'company';
  entityId?: number;
  action: 'create' | 'update' | 'delete';
  changeData: any;
  oldData?: any;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
