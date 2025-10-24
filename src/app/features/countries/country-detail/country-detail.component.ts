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
import { Country } from '../../../core/models/country.model';
import { HistoryEntry } from '../../../core/models/history.model';
import { CountryService } from '../../../core/services/country.service';
import { AuthService } from '../../../core/services/auth.service';
import { HistoryDrawerComponent } from '../../../shared/history-drawer/history-drawer.component';

@Component({
  selector: 'app-country-detail',
  standalone: true,
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
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.scss'
})
export class CountryDetailComponent implements OnInit {
  countryForm!: FormGroup;
  countryId!: number;
  country?: Country;
  history: HistoryEntry[] = [];
  isEditMode = false;
  isNewCountry = false;
  historyDrawerOpened = false;
  canEdit = false;
  canDelete = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private countryService: CountryService,
    private authService: AuthService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.canEdit = this.authService.canEdit();
    this.canDelete = this.authService.canDelete();

    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.isNewCountry = true;
      this.isEditMode = true;
    } else {
      this.countryId = Number(id);
      this.loadCountry();
      this.loadHistory();
    }
  }

  initForm(): void {
    this.countryForm = this.fb.group({
      name: [{value: '', disabled: true}, Validators.required],
      code: [{value: '', disabled: true}, [Validators.required, Validators.maxLength(3)]],
      region: [{value: '', disabled: true}, Validators.required],
      capital: [{value: '', disabled: true}],
      currency: [{value: '', disabled: true}],
      language: [{value: '', disabled: true}],
      population: [{value: 0, disabled: true}, [Validators.min(0)]],
      area: [{value: 0, disabled: true}, [Validators.min(0)]],
      status: [{value: 'active', disabled: true}, Validators.required]
    });
  }

  loadCountry(): void {
    this.countryService.getCountryById(this.countryId).subscribe(country => {
      if (country) {
        this.country = country;
        this.countryForm.patchValue(country);
        // If entity is pending, force view mode only
        if (country.approvalStatus === 'pending') {
          this.isEditMode = false;
          this.countryForm.disable();
        }
      }
    });
  }

  loadHistory(): void {
    this.countryService.getHistory(this.countryId).subscribe(history => {
      this.history = history;
    });
  }

  toggleEditMode(): void {
    // Prevent entering edit mode if entity is pending approval
    if (!this.isEditMode && this.country?.approvalStatus === 'pending') {
      return;
    }

    this.isEditMode = !this.isEditMode;
    if (this.isEditMode && this.canEdit) {
      this.countryForm.enable();
    } else {
      this.countryForm.disable();
      if (this.country) {
        this.countryForm.patchValue(this.country);
      }
    }
  }

  save(): void {
    if (this.countryForm.valid) {
      const formValue = this.countryForm.value;

      if (this.isNewCountry) {
        this.countryService.createCountry(formValue).subscribe(newCountry => {
          this.router.navigate(['/countries']);
        });
      } else {
        this.countryService.updateCountry(this.countryId, formValue).subscribe(updatedCountry => {
          if (updatedCountry) {
            this.country = updatedCountry;
            this.isEditMode = false;
            this.countryForm.disable();
            this.loadHistory();
          }
        });
      }
    }
  }

  discard(): void {
    if (this.isNewCountry) {
      this.router.navigate(['/countries']);
    } else {
      this.isEditMode = false;
      this.countryForm.disable();
      if (this.country) {
        this.countryForm.patchValue(this.country);
      }
    }
  }

  delete(): void {
    if (this.canDelete && confirm(`Are you sure you want to delete ${this.country?.name}?`)) {
      this.countryService.deleteCountry(this.countryId).subscribe(() => {
        this.router.navigate(['/countries']);
      });
    }
  }

  toggleHistory(): void {
    this.historyDrawerOpened = !this.historyDrawerOpened;
  }

  get isDirty(): boolean {
    return this.countryForm.dirty;
  }

  get canToggleEditMode(): boolean {
    return this.canEdit && this.country?.approvalStatus !== 'pending';
  }
}
