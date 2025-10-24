import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Company } from '../models/company.model';
import { HistoryEntry } from '../models/history.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = `${environment.apiUrl}/companies`;

  private companies: Company[] = [
    {
      id: 1,
      name: 'TechCorp Inc',
      industry: 'Technology',
      email: 'contact@techcorp.com',
      phone: '+1-555-0100',
      address: '123 Tech Street, San Francisco, CA 94105',
      status: 'active',
      employeeCount: 150,
      createdAt: new Date('2020-01-15'),
      updatedAt: new Date('2024-10-15')
    },
    {
      id: 2,
      name: 'HealthPlus Solutions',
      industry: 'Healthcare',
      email: 'info@healthplus.com',
      phone: '+1-555-0200',
      address: '456 Medical Ave, Boston, MA 02108',
      status: 'active',
      employeeCount: 300,
      createdAt: new Date('2019-05-20'),
      updatedAt: new Date('2024-09-20')
    },
    {
      id: 3,
      name: 'FinanceWise Ltd',
      industry: 'Finance',
      email: 'support@financewise.com',
      phone: '+1-555-0300',
      address: '789 Wall St, New York, NY 10005',
      status: 'active',
      employeeCount: 500,
      createdAt: new Date('2018-03-10'),
      updatedAt: new Date('2024-10-10')
    },
    {
      id: 4,
      name: 'EduLearn Academy',
      industry: 'Education',
      email: 'admin@edulearn.com',
      phone: '+1-555-0400',
      address: '321 Learning Lane, Chicago, IL 60601',
      status: 'inactive',
      employeeCount: 75,
      createdAt: new Date('2021-07-05'),
      updatedAt: new Date('2024-08-15')
    },
    {
      id: 5,
      name: 'RetailMart Global',
      industry: 'Retail',
      email: 'help@retailmart.com',
      phone: '+1-555-0500',
      address: '555 Commerce Blvd, Los Angeles, CA 90001',
      status: 'active',
      employeeCount: 1200,
      createdAt: new Date('2015-11-12'),
      updatedAt: new Date('2024-10-12')
    }
  ];

  private history: HistoryEntry[] = [
    {
      id: 1,
      entityType: 'company',
      entityId: 1,
      action: 'updated',
      field: 'employeeCount',
      oldValue: '120',
      newValue: '150',
      changedBy: 'HR Manager',
      changedAt: new Date('2024-10-15')
    },
    {
      id: 2,
      entityType: 'company',
      entityId: 1,
      action: 'updated',
      field: 'phone',
      oldValue: '+1-555-0101',
      newValue: '+1-555-0100',
      changedBy: 'Admin',
      changedAt: new Date('2024-10-10')
    }
  ];

  private companiesSubject = new BehaviorSubject<Company[]>(this.companies);

  constructor(private http: HttpClient) { }

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl);
  }

  getCompanyById(id: number): Observable<Company | undefined> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`);
  }

  createCompany(company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Observable<any> {
    return this.http.post<any>(this.apiUrl, company);
  }

  updateCompany(id: number, updates: Partial<Company>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updates);
  }

  deleteCompany(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getHistory(entityId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${entityId}/history`);
  }

  private addHistoryEntry(entry: Omit<HistoryEntry, 'id'>): void {
    const newEntry: HistoryEntry = {
      ...entry,
      id: Math.max(...this.history.map(h => h.id), 0) + 1
    };
    this.history.push(newEntry);
  }
}
