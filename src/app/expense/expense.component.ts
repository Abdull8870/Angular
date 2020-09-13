import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../CommonService/expense.service';
import { Expense } from '../models/expense.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  id:string;
  private sub:Subscription;
  isLoading:boolean;
  finalExpense:Expense[]=[];
  displayedColumns: string[] = ['name', 'to', 'amount'];
  constructor(private expenseService:ExpenseService,private route: ActivatedRoute) { }

  ngOnInit() {
    this.isLoading=true;
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.expenseService.getExpense(this.id);
        }
      );
    this.sub =this.expenseService.getBillasObservable().
    subscribe((result)=>{
     this.isLoading=false;
     this.finalExpense=result.expense.filter(x=>{
       if(x.amount!=0){
         return x;
       }
     });
     });

  }

}
