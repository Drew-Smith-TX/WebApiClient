import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';

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
  constructor(private auth: AuthService) { }

  ngOnInit() {
    console.log('From Register');
    // console.log(this.valuesFromHome);
  }
  register() {
    this.auth.register(this.model)
      .subscribe(() => {
        console.log('registration successful');
      }, error => {
        console.log(error);
      });
    console.log(this.model);
  }
  cancel(){
    this.cancelRegister.emit(false);
    console.log('cancelled');
  }
}
