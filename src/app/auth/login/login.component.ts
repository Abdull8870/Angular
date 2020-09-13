import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AuthService } from '../auth.service';
import { Subscription } from "rxjs";
import { Router } from "@angular/router";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {
   isLoading = false;
   isForgetPassword:boolean=false;
   private authStatusSub: Subscription;

  constructor(private authService:AuthService,private router: Router) { }

  onForgetPassword(){
   this.router.navigate(["/reset"]);
}
   onLogin(form: NgForm) {
     this.authService.login(form.value.email,form.value.password);
   }

   onRest(form: NgForm){
      this.authService.forgetPassword(form.value.email);
   }


  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
    authStatus => {
      this.isLoading = false;
    }
  );
  }

    ngOnDestroy():void{
    this.authStatusSub.unsubscribe();
  }

}
