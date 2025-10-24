export interface HistoryEntry {
  id: number;
  entityType: 'user' | 'company';
  entityId: number;
  action: string;
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  changedAt: Date;
}
