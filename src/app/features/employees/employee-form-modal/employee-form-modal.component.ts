import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Employee } from '../../../core/models/employee.model';
import { Company } from '../../../core/models/company.model';
import { EmployeeService } from '../../../core/services/employee.service';
import { CompanyService } from '../../../core/services/company.service';

@Component({
  selector: 'app-employee-form-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './employee-form-modal.component.html',
  styleUrl: './employee-form-modal.component.scss'
})
export class EmployeeFormModalComponent implements OnInit {
  employeeForm!: FormGroup;
  isEditMode = false;
  companies: Company[] = [];

  constructor(
    public dialogRef: MatDialogRef<EmployeeFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employee?: Employee },
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private companyService: CompanyService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadCompanies();
    if (this.data.employee) {
      this.isEditMode = true;
      this.employeeForm.patchValue(this.data.employee);
    }
  }

  loadCompanies(): void {
    this.companyService.getCompanies().subscribe(companies => {
      this.companies = companies;
    });
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      employeeId: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      department: ['', Validators.required],
      position: ['', Validators.required],
      hireDate: ['', Validators.required],
      companyId: ['', Validators.required],
      status: ['active', Validators.required]
    });
  }

  save(): void {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;

      if (this.isEditMode && this.data.employee) {
        this.employeeService.updateEmployee(this.data.employee.id, formValue).subscribe(updatedEmployee => {
          this.dialogRef.close(updatedEmployee);
        });
      } else {
        this.employeeService.createEmployee(formValue).subscribe(newEmployee => {
          this.dialogRef.close(newEmployee);
        });
      }
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
