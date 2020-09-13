import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HeadersComponent } from './headers/headers.component';
import { HomeComponent } from './home/home.component';
import { ProjectComponent } from './project/project.component';
import { UsersComponent } from './users/users.component';
import { ExpenseComponent } from './expense/expense.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { ResetComponent } from './auth/reset/reset.component';
import { HistoryComponent } from './history/history.component';
import { DialogueComponent } from './dialogue/dialogue.component';
import { AfterAuthGuard } from './auth/afterauth.guard';



const appRoutes: Routes = [
   { path: '', redirectTo: '/home', pathMatch: 'full' },
   { path: 'home', component: HomeComponent,canActivate: [AuthGuard] },
   { path: 'project', component: ProjectComponent,canActivate: [AuthGuard] },
   { path: 'Users/:id', component: UsersComponent,canActivate: [AuthGuard] },
   { path: 'expense/:id', component: ExpenseComponent,canActivate: [AuthGuard] },
   { path: 'history/:id', component: HistoryComponent,canActivate: [AuthGuard] },
   { path: 'login', component: LoginComponent,canActivate: [AfterAuthGuard] },
   { path: 'signup', component: SignupComponent,canActivate: [AfterAuthGuard] },
   { path: 'reset', component: ResetComponent,canActivate: [AfterAuthGuard] },
   { path: 'not-found', component: DialogueComponent },
   { path: '**', redirectTo: '/not-found' }


];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
