import { Component, Inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-form-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './user-form-modal.component.html',
  styleUrl: './user-form-modal.component.scss'
})
export class UserFormModalComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  roles = computed(() => this.userService.roles());

  constructor(
    public dialogRef: MatDialogRef<UserFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User },
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.data.user) {
      this.isEditMode = true;
      this.userForm.patchValue(this.data.user);
    }
  }

  initForm(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      department: ['', Validators.required],
      status: ['active', Validators.required]
    });
  }

  save(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      if (this.isEditMode && this.data.user) {
        this.userService.updateUser(this.data.user.id, formValue).subscribe(updatedUser => {
          this.dialogRef.close(updatedUser);
        });
      } else {
        this.userService.createUser(formValue).subscribe(newUser => {
          this.dialogRef.close(newUser);
        });
      }
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
