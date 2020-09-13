import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { AuthData } from "./auth-data-model";
import { ProjectService } from '../CommonService/projectapi.service';
import { User } from '../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { WebsocketsService } from '../websockets.service'

const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private ResetuserId: string;
  private authStatusListener = new Subject<boolean>();
  private resetToken:string;
  private countries:string[]=[];
  private phoneCode:{code:string,num:string}[]=[];
  private phoneCodeListner = new Subject<{countries:string[],phoneCode:{code:string,num:string}[]}>();

  constructor(private http: HttpClient, private router: Router,private projectService:ProjectService,
  private toastr: ToastrService,private websocketsService:WebsocketsService) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  forgetPassword(email:string) {
    const _email={email:email};
   this.http.post<{ message: string; id: string}>(BACKEND_URL + "reset",_email).subscribe(
     (result) => {

       this.ResetuserId=result.id;
       localStorage.setItem("ResetuserId",this.ResetuserId);
       this.router.navigate(["/reset"]);
       },
     error => {
       this.authStatusListener.next(false);
       this.toastr.error(`${error.error.message}`, 'AN ERROR OCCURED', {
       timeOut: 3000,
       });
       this.router.navigate(["/login"]);
     }
   );

  }

  resetPassword(password:string,code:string) {
    const uId=localStorage.getItem("ResetuserId");
    const data={password:password,token:code,id:uId};
    this.http.post(BACKEND_URL + "resetPassword", data).subscribe(
      () => {
        localStorage.removeItem("ResetuserId");
        this.router.navigate(["/login"]);
        this.toastr.success('Your Password Has been reset successfully','Success', {
        timeOut: 3000,
        });
      },
      error => {
        this.router.navigate(["/login"]);
        this.authStatusListener.next(false);
        this.toastr.error(`${error.error.message}`, 'AN ERROR OCCURED', {
        timeOut: 3000,
        });
      }
    );
  }

  createUser(data:User) {
    const authData: User = data;
    this.http.post(BACKEND_URL + "/signup", authData).subscribe(
      () => {
        this.router.navigate(["/login"]);
      },
      error => {
        this.authStatusListener.next(false);
        this.toastr.warning(`${error.error.message}`, 'AN ERROR OCCURED', {
        timeOut: 3000,
        });
        this.router.navigate(["/login"]);
      }
    );
  }

  login(email: string, password: string) {

    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + "/login",
        authData
      )
      .subscribe(
        response => {
          const token = response.token;
          this.token = token;
          if (token) {

            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(token, expirationDate, this.userId);
            this.websocketsService.verifyUser('set-user',token);
            localStorage.setItem("email", email);
            this.router.navigate(["/home"]);
            this.toastr.success('You have logged in successfully','Success', {
            timeOut: 3000,
            });
          }
        },
        error => {
          this.authStatusListener.next(false);
          this.toastr.error(`${error.error.message}`, 'AN ERROR OCCURED', {
          timeOut: 3000,
          });
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }

   getCountryCodes(){
     this.http.get<{message:string,countries:string[],phoneCode:{code:string,num:string}[]}>(BACKEND_URL+'countrycodes').
     subscribe(data=>{
       this.countries=data.countries;
       this.phoneCode=data.phoneCode;
       this.phoneCodeListner.next({countries:this.countries,phoneCode:this.phoneCode});
     },err=>{
       console.log(err);

     });
  }


 getPhoneAsObservable(){
   return this.phoneCodeListner.asObservable();
 }
}
