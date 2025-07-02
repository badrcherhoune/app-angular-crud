import { Component, OnInit } from '@angular/core';
import { User } from './user.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../users.service';
import { MatTableDataSource } from '@angular/material/table';
import { EditUserDialogComponent } from '../editUserDialog/edit-user-dialog/edit-user-dialog.component';
@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'username', 'age', 'type', 'actions'];
  dataSource = new MatTableDataSource<User>();

  constructor(
    private userService: UsersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.dataSource.data = users;
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '400px',
      data: {user: {id: 0, username: '', age: 0, type: ''}, isNew: true}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.addUser(result).subscribe(() => {
          this.loadUsers();
          this.showSnackbar('Utilisateur ajouté avec succès');
        });
      }
    });
  }

  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '400px',
      data: {user: {...user}, isNew: false}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateUser(result).subscribe(() => {
          this.loadUsers();
          this.showSnackbar('Utilisateur mis à jour avec succès');
        });
      }
    });
  }

  deleteUser(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe(success => {
        if (success) {
          this.loadUsers();
          this.showSnackbar('Utilisateur supprimé avec succès');
        }
      });
    }
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000
    });
  }
}