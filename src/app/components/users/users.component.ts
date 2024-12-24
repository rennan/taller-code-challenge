import { Component, OnInit } from '@angular/core';
import { IUser } from '../../interfaces/users.interface';
import { UsersService } from '../../services/users.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private users: IUser[] = [];

  filteredUsers: IUser[] = [];

  searchForm: FormGroup = new FormGroup({
    search: new FormControl(null),
  });


  constructor(private readonly usersService: UsersService) {}

  ngOnInit(): void {
    this.getUsers();
    this.monitorySearchControl();
  }

  private getUsers(): void {
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
    this.searchForm
      .get('search')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((search) => {
        this.filterUsers(search ?? '');
      });
  }
}
