import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(public auth: AuthService,
              private alert: AlertifyService,
              private router: Router) { }

  ngOnInit() {
  }

  login(){
    this.auth.login(this.model).subscribe(next => {
        this.alert.success('Logged in sucessfully');
      }, error => {
        this.alert.error('error: Failed to LOGIN');
      }, () => {
        this.router.navigate(['/members']);
      });
  }
  loggedIn(){
    return this.auth.loggedIn();
  }
  logout() {
    localStorage.removeItem('token');
    this.alert.message('logged out');
    this.router.navigate(['/home']);
  }
}
