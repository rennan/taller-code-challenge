import { UsersService } from './../../services/users.service';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IUser } from '../../interfaces/users.interface';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'users-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit, OnDestroy {
  users: IUser[] = [];
  filteredUsers: IUser[] = [];
  searchForm: FormGroup = new FormGroup({
    search: new FormControl(null),
  });

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly usersService: UsersService) {}

  ngOnInit(): void {
    this.fetchUsersFromApi();
    this.monitorySearchControl();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private fetchUsersFromApi(): void {
    this.usersService.getUsers().subscribe((users) => {
      this.users = users;
      this.filteredUsers = users;
    });
  }

  private filterUsers(search: string): void {
    this.filteredUsers = this.users.filter((user) => {
      const match = user.name.toLowerCase().includes(search.toLowerCase());
      return match;
    });
  }

  private monitorySearchControl(): void {
    this.searchForm.get('search')?.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((search) => {
        this.filterUsers(search as string);
      });
  }
}
