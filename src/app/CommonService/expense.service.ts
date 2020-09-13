import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { Expense } from '../models/expense.model';
import { Project } from "../models/project.model";
import { ToastrService } from 'ngx-toastr';

const BACKEND_URL = environment.apiUrl + "/expense/";

@Injectable({ providedIn: "root" })
export class ExpenseService {

  private expenseSub= new Subject<{expense:Expense[]}>();
  public expense:Expense[];
  constructor(private http: HttpClient, private router: Router,
  private toastr: ToastrService) {}

  getBillasObservable()
  {
    return this.expenseSub.asObservable();
  }

    postExpense(_expense:any[],id:string) {
      const data={
        projectId:id,
        expense:_expense
      };
      this.http
        .post<{ message: string; expense: Project }>(
          BACKEND_URL,
          data
        )
        .subscribe(responseData => {
          this.expense=responseData.expense.expenses;
          this.expenseSub.next({expense:[...this.expense]});
          this.router.navigate(["/expense",id]);
        },error=>{
          this.router.navigate(["/project"]);
          this.toastr.error(`${error.error.message}`, 'AN ERROR OCCURED', {
          timeOut: 3000,
          });
        });
    }

    getExpense(id:string) {
      const data={
        projectId:id
      };
      this.http
        .post<{ message: string; expense: Project }>(
          BACKEND_URL+'get',
          data
        )
        .subscribe(responseData => {
          this.expense=responseData.expense.expenses;
          this.expenseSub.next({expense:[...this.expense]});
        },error=>{
          this.router.navigate(["/project"]);
          this.toastr.error(`${error.error.message}`, 'AN ERROR OCCURED', {
          timeOut: 3000,
          });
        });
    }




}
