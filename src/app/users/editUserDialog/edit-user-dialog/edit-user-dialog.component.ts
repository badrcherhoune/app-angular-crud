import { Component, Inject, ViewChild, type OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import type { User } from '../../users/user.model';
import type { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-user-dialog',
  standalone: false,
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.css'
})
export class EditUserDialogComponent implements OnInit {
  userTypes = ['Admin', 'User', 'Guest'];
  isNewUser: boolean;
  
  @ViewChild('editForm') editForm?: NgForm;

  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {user: User, isNew: boolean}
  ) {
    this.isNewUser = data.isNew;
  }

  ngOnInit(): void {
  }

  isFormValid(): boolean {
    return this.editForm?.valid || false;
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}