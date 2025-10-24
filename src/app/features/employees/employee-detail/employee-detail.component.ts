import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Employee } from '../../../core/models/employee.model';
import { Company } from '../../../core/models/company.model';
import { EmployeeService } from '../../../core/services/employee.service';
import { CompanyService } from '../../../core/services/company.service';
import { AuthService } from '../../../core/services/auth.service';
import { HistoryDrawerComponent } from '../../../shared/history-drawer/history-drawer.component';

@Component({
  selector: 'app-employee-detail',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSidenavModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HistoryDrawerComponent
  ],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss'
})
export class EmployeeDetailComponent implements OnInit {
  employeeForm!: FormGroup;
  employeeId!: number;
  employee?: Employee;
  companies: Company[] = [];
  history: any[] = [];
  isEditMode = false;
  isNewEmployee = false;
  historyDrawerOpened = false;
  canEdit = false;
  canDelete = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private authService: AuthService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.canEdit = this.authService.canEdit();
    this.canDelete = this.authService.canDelete();
    this.loadCompanies();

    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.isNewEmployee = true;
      this.isEditMode = true;
    } else {
      this.employeeId = Number(id);
      this.loadEmployee();
      this.loadHistory();
    }
  }

  loadCompanies(): void {
    this.companyService.getCompanies().subscribe(companies => {
      this.companies = companies;
    });
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      employeeId: [{value: '', disabled: true}, Validators.required],
      name: [{value: '', disabled: true}, Validators.required],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      phone: [{value: '', disabled: true}],
      department: [{value: '', disabled: true}, Validators.required],
      position: [{value: '', disabled: true}, Validators.required],
      hireDate: [{value: '', disabled: true}, Validators.required],
      companyId: [{value: '', disabled: true}, Validators.required],
      status: [{value: 'active', disabled: true}, Validators.required]
    });
  }

  loadEmployee(): void {
    this.employeeService.getEmployeeById(this.employeeId).subscribe(employee => {
      if (employee) {
        this.employee = employee;
        this.employeeForm.patchValue(employee);
        // If entity is pending, force view mode only
        if (employee.approvalStatus === 'pending') {
          this.isEditMode = false;
          this.employeeForm.disable();
        }
      }
    });
  }

  loadHistory(): void {
    this.employeeService.getHistory(this.employeeId).subscribe(history => {
      this.history = history;
    });
  }

  toggleEditMode(): void {
    // Prevent entering edit mode if entity is pending approval
    if (!this.isEditMode && this.employee?.approvalStatus === 'pending') {
      return;
    }

    this.isEditMode = !this.isEditMode;
    if (this.isEditMode && this.canEdit) {
      this.employeeForm.enable();
    } else {
      this.employeeForm.disable();
      if (this.employee) {
        this.employeeForm.patchValue(this.employee);
      }
    }
  }

  save(): void {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;

      if (this.isNewEmployee) {
        this.employeeService.createEmployee(formValue).subscribe(newEmployee => {
          this.router.navigate(['/employees']);
        });
      } else {
        this.employeeService.updateEmployee(this.employeeId, formValue).subscribe(updatedEmployee => {
          if (updatedEmployee) {
            this.employee = updatedEmployee;
            this.isEditMode = false;
            this.employeeForm.disable();
            this.loadHistory();
          }
        });
      }
    }
  }

  discard(): void {
    if (this.isNewEmployee) {
      this.router.navigate(['/employees']);
    } else {
      this.isEditMode = false;
      this.employeeForm.disable();
      if (this.employee) {
        this.employeeForm.patchValue(this.employee);
      }
    }
  }

  delete(): void {
    if (this.canDelete && confirm(`Are you sure you want to delete ${this.employee?.name}?`)) {
      this.employeeService.deleteEmployee(this.employeeId).subscribe(() => {
        this.router.navigate(['/employees']);
      });
    }
  }

  toggleHistory(): void {
    this.historyDrawerOpened = !this.historyDrawerOpened;
  }

  get isDirty(): boolean {
    return this.employeeForm.dirty;
  }

  get canToggleEditMode(): boolean {
    return this.canEdit && this.employee?.approvalStatus !== 'pending';
  }
}
