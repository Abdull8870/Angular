import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeadersComponent } from './headers/headers.component';
import { HomeComponent } from './home/home.component';
import { ProjectComponent } from './project/project.component';
import { UsersComponent } from './users/users.component';
import { ExpenseComponent } from './expense/expense.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import { ToastrModule } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { HttpClientModule ,HTTP_INTERCEPTORS} from "@angular/common/http";
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from "./Interceptor/auth-interceptor";
import { ResetComponent } from './auth/reset/reset.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogueComponent } from './dialogue/dialogue.component';
import { HistoryComponent } from './history/history.component';
import { MatPaginatorModule} from '@angular/material/paginator';
import { AfterAuthGuard } from './auth/afterauth.guard';


@NgModule({
  declarations: [
    AppComponent,
    HeadersComponent,
    HomeComponent,
    ProjectComponent,
    UsersComponent,
    ExpenseComponent,
    SignupComponent,
    LoginComponent,
    ResetComponent,
    DialogueComponent,
    HistoryComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    ToastrModule.forRoot(),
    MatProgressSpinnerModule,
    HttpClientModule,
    MatTableModule,
    MatDialogModule,
    MatPaginatorModule
  ],
  providers: [AuthGuard,AfterAuthGuard,{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
  entryComponents:[DialogueComponent]
})
export class AppModule { }
