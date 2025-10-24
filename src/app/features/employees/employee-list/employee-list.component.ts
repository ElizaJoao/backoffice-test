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
import { Employee } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';
import { EmployeeFormModalComponent } from '../employee-form-modal/employee-form-modal.component';

@Component({
  selector: 'app-employee-list',
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
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = ['employeeId', 'name', 'email', 'department', 'position', 'company', 'status', 'approvalStatus', 'actions'];
  dataSource!: MatTableDataSource<Employee>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  showFilters = false;

  filterValues = {
    employeeId: '',
    name: '',
    email: '',
    department: '',
    position: '',
    status: ''
  };

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Employee>([]);
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(employees => {
      this.dataSource.data = employees;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.setupFilter();
    });
  }

  setupFilter(): void {
    this.dataSource.filterPredicate = (data: Employee, filter: string) => {
      const filters = JSON.parse(filter);

      const matchEmployeeId = !filters.employeeId || data.employeeId.toLowerCase().includes(filters.employeeId.toLowerCase());
      const matchName = !filters.name || data.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchEmail = !filters.email || data.email.toLowerCase().includes(filters.email.toLowerCase());
      const matchDepartment = !filters.department || data.department.toLowerCase().includes(filters.department.toLowerCase());
      const matchPosition = !filters.position || data.position.toLowerCase().includes(filters.position.toLowerCase());
      const matchStatus = !filters.status || data.status === filters.status;

      return matchEmployeeId && matchName && matchEmail && matchDepartment && matchPosition && matchStatus;
    };
  }

  applyFilter(field: string, value: string): void {
    this.filterValues[field as keyof typeof this.filterValues] = value;
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  clearFilters(): void {
    this.filterValues = {
      employeeId: '',
      name: '',
      email: '',
      department: '',
      position: '',
      status: ''
    };
    this.dataSource.filter = '';
  }

  hasActiveFilters(): boolean {
    return Object.values(this.filterValues).some(value => value !== '');
  }

  getActiveFilterCount(): number {
    return Object.values(this.filterValues).filter(value => value !== '').length;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  addEmployee(): void {
    const dialogRef = this.dialog.open(EmployeeFormModalComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEmployees();
      }
    });
  }

  viewEmployee(employee: Employee): void {
    this.router.navigate(['/employees', employee.id]);
  }

  deleteEmployee(employee: Employee, event: Event): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
      this.employeeService.deleteEmployee(employee.id).subscribe(() => {
        this.loadEmployees();
      });
    }
  }
}
