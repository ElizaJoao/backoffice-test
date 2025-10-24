import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model';
import { HistoryEntry } from '../models/history.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  private users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      department: 'IT',
      status: 'active',
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2024-10-15')
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Manager',
      department: 'Sales',
      status: 'active',
      createdAt: new Date('2023-03-20'),
      updatedAt: new Date('2024-09-10')
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: 'Developer',
      department: 'IT',
      status: 'active',
      createdAt: new Date('2023-05-10'),
      updatedAt: new Date('2024-10-01')
    },
    {
      id: 4,
      name: 'Alice Williams',
      email: 'alice.williams@example.com',
      role: 'Designer',
      department: 'Marketing',
      status: 'inactive',
      createdAt: new Date('2023-07-05'),
      updatedAt: new Date('2024-08-20')
    },
    {
      id: 5,
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      role: 'Analyst',
      department: 'Finance',
      status: 'active',
      createdAt: new Date('2023-09-12'),
      updatedAt: new Date('2024-10-12')
    }
  ];

  private history: HistoryEntry[] = [
    {
      id: 1,
      entityType: 'user',
      entityId: 1,
      action: 'updated',
      field: 'role',
      oldValue: 'Developer',
      newValue: 'Admin',
      changedBy: 'System Admin',
      changedAt: new Date('2024-10-15')
    },
    {
      id: 2,
      entityType: 'user',
      entityId: 1,
      action: 'updated',
      field: 'department',
      oldValue: 'Development',
      newValue: 'IT',
      changedBy: 'HR Manager',
      changedAt: new Date('2024-10-10')
    }
  ];

  private usersSubject = new BehaviorSubject<User[]>(this.users);

  roles = signal<string[]>(['Admin', 'Viewer', 'Sales', 'Finance', 'Developer', 'Designer', 'Tester']);

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User | undefined> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  updateUser(id: number, updates: Partial<User>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updates);
  }

  deleteUser(id: number): Observable<any> {
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
