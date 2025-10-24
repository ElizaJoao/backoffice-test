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
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../../core/models/user.model';
import { HistoryEntry } from '../../../core/models/history.model';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { HistoryDrawerComponent } from '../../../shared/history-drawer/history-drawer.component';
import { ResetPasswordDialogComponent } from '../../../shared/reset-password-dialog/reset-password-dialog.component';

@Component({
  selector: 'app-user-detail',
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
    MatSnackBarModule,
    HistoryDrawerComponent
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {
  userForm!: FormGroup;
  userId!: number;
  user?: User;
  history: HistoryEntry[] = [];
  isEditMode = false;
  isNewUser = false;
  historyDrawerOpened = false;
  canEdit = false;
  canDelete = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.canEdit = this.authService.canEdit();
    this.canDelete = this.authService.canDelete();

    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.isNewUser = true;
      this.isEditMode = true;
    } else {
      this.userId = Number(id);
      this.loadUser();
      this.loadHistory();
    }
  }

  initForm(): void {
    this.userForm = this.fb.group({
      name: [{value: '', disabled: true}, Validators.required],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      role: [{value: '', disabled: true}, Validators.required],
      department: [{value: '', disabled: true}, Validators.required],
      status: [{value: 'active', disabled: true}, Validators.required]
    });
  }

  loadUser(): void {
    this.userService.getUserById(this.userId).subscribe(user => {
      if (user) {
        this.user = user;
        this.userForm.patchValue(user);
        // If entity is pending, force view mode only
        if (user.approvalStatus === 'pending') {
          this.isEditMode = false;
          this.userForm.disable();
        }
      }
    });
  }

  loadHistory(): void {
    this.userService.getHistory(this.userId).subscribe(history => {
      this.history = history;
    });
  }

  toggleEditMode(): void {
    // Prevent entering edit mode if entity is pending approval
    if (!this.isEditMode && this.user?.approvalStatus === 'pending') {
      return;
    }

    this.isEditMode = !this.isEditMode;
    if (this.isEditMode && this.canEdit) {
      this.userForm.enable();
    } else {
      this.userForm.disable();
      if (this.user) {
        this.userForm.patchValue(this.user);
      }
    }
  }

  save(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      if (this.isNewUser) {
        this.userService.createUser(formValue).subscribe(newUser => {
          this.router.navigate(['/users']);
        });
      } else {
        this.userService.updateUser(this.userId, formValue).subscribe(updatedUser => {
          if (updatedUser) {
            this.user = updatedUser;
            this.isEditMode = false;
            this.userForm.disable();
            this.loadHistory();
          }
        });
      }
    }
  }

  discard(): void {
    if (this.isNewUser) {
      this.router.navigate(['/users']);
    } else {
      this.isEditMode = false;
      this.userForm.disable();
      if (this.user) {
        this.userForm.patchValue(this.user);
      }
    }
  }

  delete(): void {
    if (this.canDelete && confirm(`Are you sure you want to delete ${this.user?.name}?`)) {
      this.userService.deleteUser(this.userId).subscribe(() => {
        this.router.navigate(['/users']);
      });
    }
  }

  toggleHistory(): void {
    this.historyDrawerOpened = !this.historyDrawerOpened;
  }

  get isDirty(): boolean {
    return this.userForm.dirty;
  }

  get canToggleEditMode(): boolean {
    return this.canEdit && this.user?.approvalStatus !== 'pending';
  }

  resetPassword(): void {
    if (!this.user) return;

    const dialogRef = this.dialog.open(ResetPasswordDialogComponent, {
      width: '500px',
      data: {
        userId: this.user.id,
        userName: this.user.name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Password reset successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }
}
