import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AfterAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router,private toastr: ToastrService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authService.getIsAuth();
    if (isAuth) {
      this.toastr.warning( 'User is already logged In','Access Denied');
      this.router.navigate(['/home']);
      return false
    }
    else {
      return true;
    }

  }
}
