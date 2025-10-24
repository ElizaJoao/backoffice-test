import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { UserFormModalComponent } from '../user-form-modal/user-form-modal.component';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'role', 'department', 'status', 'approvalStatus', 'actions'];
  dataSource!: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterValues = {
    name: '',
    email: '',
    role: '',
    department: '',
    status: ''
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<User>([]);
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.dataSource.data = users;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.setupFilter();
    });
  }

  setupFilter(): void {
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const filters = JSON.parse(filter);

      const matchName = !filters.name || data.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchEmail = !filters.email || data.email.toLowerCase().includes(filters.email.toLowerCase());
      const matchRole = !filters.role || data.role.toLowerCase().includes(filters.role.toLowerCase());
      const matchDepartment = !filters.department || data.department.toLowerCase().includes(filters.department.toLowerCase());
      const matchStatus = !filters.status || data.status === filters.status;

      return matchName && matchEmail && matchRole && matchDepartment && matchStatus;
    };
  }

  applyFilter(field: string, value: string): void {
    this.filterValues[field as keyof typeof this.filterValues] = value;
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  clearFilters(): void {
    this.filterValues = {
      name: '',
      email: '',
      role: '',
      department: '',
      status: ''
    };
    this.dataSource.filter = '';
  }

  hasActiveFilters(): boolean {
    return Object.values(this.filterValues).some(value => value !== '');
  }

  addUser(): void {
    const dialogRef = this.dialog.open(UserFormModalComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  viewUser(user: User): void {
    this.router.navigate(['/users', user.id]);
  }

  deleteUser(user: User, event: Event): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.userService.deleteUser(user.id).subscribe(() => {
        this.loadUsers();
      });
    }
  }
}
