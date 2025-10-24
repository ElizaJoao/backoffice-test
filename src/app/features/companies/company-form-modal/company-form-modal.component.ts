import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Company } from '../../../core/models/company.model';
import { CompanyService } from '../../../core/services/company.service';

@Component({
  selector: 'app-company-form-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './company-form-modal.component.html',
  styleUrl: './company-form-modal.component.scss'
})
export class CompanyFormModalComponent implements OnInit {
  companyForm!: FormGroup;
  isEditMode = false;

  constructor(
    public dialogRef: MatDialogRef<CompanyFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { company?: Company },
    private fb: FormBuilder,
    private companyService: CompanyService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.data.company) {
      this.isEditMode = true;
      this.companyForm.patchValue(this.data.company);
    }
  }

  initForm(): void {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      industry: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      employeeCount: [0, [Validators.required, Validators.min(1)]],
      status: ['active', Validators.required]
    });
  }

  save(): void {
    if (this.companyForm.valid) {
      const formValue = this.companyForm.value;

      if (this.isEditMode && this.data.company) {
        this.companyService.updateCompany(this.data.company.id, formValue).subscribe(updatedCompany => {
          this.dialogRef.close(updatedCompany);
        });
      } else {
        this.companyService.createCompany(formValue).subscribe(newCompany => {
          this.dialogRef.close(newCompany);
        });
      }
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
