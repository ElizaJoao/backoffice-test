import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PendingChange } from '../models/pending-change.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {
  private apiUrl = `${environment.apiUrl}/approvals`;

  constructor(private http: HttpClient) { }

  getPendingChanges(): Observable<PendingChange[]> {
    return this.http.get<PendingChange[]>(`${this.apiUrl}/pending`);
  }

  getChangeHistory(): Observable<PendingChange[]> {
    return this.http.get<PendingChange[]>(`${this.apiUrl}/history`);
  }

  approveChange(id: number, reviewedBy?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/approve`, { reviewedBy });
  }

  rejectChange(id: number, reason: string, reviewedBy?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reject`, { reason, reviewedBy });
  }
}
