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
import { Company } from '../../../core/models/company.model';
import { HistoryEntry } from '../../../core/models/history.model';
import { CompanyService } from '../../../core/services/company.service';
import { AuthService } from '../../../core/services/auth.service';
import { HistoryDrawerComponent } from '../../../shared/history-drawer/history-drawer.component';

@Component({
  selector: 'app-company-detail',
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
    HistoryDrawerComponent
  ],
  templateUrl: './company-detail.component.html',
  styleUrl: './company-detail.component.scss'
})
export class CompanyDetailComponent implements OnInit {
  companyForm!: FormGroup;
  companyId!: number;
  company?: Company;
  history: HistoryEntry[] = [];
  isEditMode = false;
  isNewCompany = false;
  historyDrawerOpened = false;
  canEdit = false;
  canDelete = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private companyService: CompanyService,
    private authService: AuthService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.canEdit = this.authService.canEdit();
    this.canDelete = this.authService.canDelete();

    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.isNewCompany = true;
      this.isEditMode = true;
    } else {
      this.companyId = Number(id);
      this.loadCompany();
      this.loadHistory();
    }
  }

  initForm(): void {
    this.companyForm = this.fb.group({
      name: [{value: '', disabled: true}, Validators.required],
      industry: [{value: '', disabled: true}, Validators.required],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      phone: [{value: '', disabled: true}, Validators.required],
      address: [{value: '', disabled: true}, Validators.required],
      employeeCount: [{value: 0, disabled: true}, [Validators.required, Validators.min(1)]],
      status: [{value: 'active', disabled: true}, Validators.required]
    });
  }

  loadCompany(): void {
    this.companyService.getCompanyById(this.companyId).subscribe(company => {
      if (company) {
        this.company = company;
        this.companyForm.patchValue(company);
        // If entity is pending, force view mode only
        if (company.approvalStatus === 'pending') {
          this.isEditMode = false;
          this.companyForm.disable();
        }
      }
    });
  }

  loadHistory(): void {
    this.companyService.getHistory(this.companyId).subscribe(history => {
      this.history = history;
    });
  }

  toggleEditMode(): void {
    // Prevent entering edit mode if entity is pending approval
    if (!this.isEditMode && this.company?.approvalStatus === 'pending') {
      return;
    }

    this.isEditMode = !this.isEditMode;
    if (this.isEditMode && this.canEdit) {
      this.companyForm.enable();
    } else {
      this.companyForm.disable();
      if (this.company) {
        this.companyForm.patchValue(this.company);
      }
    }
  }

  save(): void {
    if (this.companyForm.valid) {
      const formValue = this.companyForm.value;

      if (this.isNewCompany) {
        this.companyService.createCompany(formValue).subscribe(newCompany => {
          this.router.navigate(['/companies']);
        });
      } else {
        this.companyService.updateCompany(this.companyId, formValue).subscribe(updatedCompany => {
          if (updatedCompany) {
            this.company = updatedCompany;
            this.isEditMode = false;
            this.companyForm.disable();
            this.loadHistory();
          }
        });
      }
    }
  }

  discard(): void {
    if (this.isNewCompany) {
      this.router.navigate(['/companies']);
    } else {
      this.isEditMode = false;
      this.companyForm.disable();
      if (this.company) {
        this.companyForm.patchValue(this.company);
      }
    }
  }

  delete(): void {
    if (this.canDelete && confirm(`Are you sure you want to delete ${this.company?.name}?`)) {
      this.companyService.deleteCompany(this.companyId).subscribe(() => {
        this.router.navigate(['/companies']);
      });
    }
  }

  toggleHistory(): void {
    this.historyDrawerOpened = !this.historyDrawerOpened;
  }

  get isDirty(): boolean {
    return this.companyForm.dirty;
  }

  get canToggleEditMode(): boolean {
    return this.canEdit && this.company?.approvalStatus !== 'pending';
  }
}
