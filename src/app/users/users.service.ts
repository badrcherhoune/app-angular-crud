import { Injectable } from '@angular/core';
import { User } from './users/user.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private users: User[] = [
    { id: 1, username: 'user1', age: 25, type: 'Admin' },
    { id: 2, username: 'user2', age: 30, type: 'User' },
    { id: 3, username: 'user3', age: 22, type: 'User' }
  ];

  constructor() { }

  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  addUser(user: User): Observable<User> {
    user.id = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
    this.users.push(user);
    return of(user);
  }

  updateUser(user: User): Observable<User> {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
    return of(user);
  }

  deleteUser(id: number): Observable<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
