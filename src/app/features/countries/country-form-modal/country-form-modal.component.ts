import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Country } from '../../../core/models/country.model';
import { CountryService } from '../../../core/services/country.service';

@Component({
  selector: 'app-country-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './country-form-modal.component.html',
  styleUrl: './country-form-modal.component.scss'
})
export class CountryFormModalComponent implements OnInit {
  countryForm!: FormGroup;
  isEditMode = false;

  constructor(
    public dialogRef: MatDialogRef<CountryFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { country?: Country },
    private fb: FormBuilder,
    private countryService: CountryService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.data.country) {
      this.isEditMode = true;
      this.countryForm.patchValue(this.data.country);
    }
  }

  initForm(): void {
    this.countryForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', [Validators.required, Validators.maxLength(3)]],
      region: ['', Validators.required],
      capital: [''],
      currency: [''],
      language: [''],
      population: [0, [Validators.min(0)]],
      area: [0, [Validators.min(0)]],
      status: ['active', Validators.required]
    });
  }

  save(): void {
    if (this.countryForm.valid) {
      const formValue = this.countryForm.value;

      if (this.isEditMode && this.data.country) {
        this.countryService.updateCountry(this.data.country.id, formValue).subscribe(updatedCountry => {
          this.dialogRef.close(updatedCountry);
        });
      } else {
        this.countryService.createCountry(formValue).subscribe(newCountry => {
          this.dialogRef.close(newCountry);
        });
      }
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
