import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // values taken from home component
  // @Input() valuesFromHome: any;
  @Output() cancelRegister = new EventEmitter();

  model: any = {};
  constructor(private auth: AuthService,
              private alert: AlertifyService) { }

  ngOnInit() {
    this.alert.message('From Register');
    // console.log(this.valuesFromHome);
  }
  register() {
    this.auth.register(this.model)
      .subscribe(() => {
        this.alert.success('registration successful');
      }, error => {
        this.alert.error(error);
      });
    console.log(this.model);
  }
  cancel(){
    this.cancelRegister.emit(false);
    console.log('cancelled');
  }
}
