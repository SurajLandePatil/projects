import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { User } from 'src/app/models/user.model'; // adjust if needed

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = false;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        // Handle error, maybe use a snackbar/toast
      }
    });
  }
}
