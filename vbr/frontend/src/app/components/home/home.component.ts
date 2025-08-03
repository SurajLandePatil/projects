import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateToUserLogin(): void {
    this.router.navigate(['/user/login']);
  }

  navigateToMechanicLogin(): void {
    this.router.navigate(['/mechanic/login']);
  }

  navigateToAdminLogin(): void {
    this.router.navigate(['/admin/login']);
  }
}
