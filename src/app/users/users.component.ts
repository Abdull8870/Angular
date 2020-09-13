import { Component, OnInit,TemplateRef, Injectable, ViewChild,OnDestroy  } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ProjectService } from '../CommonService/projectapi.service';
import { ExpenseService } from '../CommonService/expense.service';
import { Project } from '../models/project.model';
import { ToastrService } from 'ngx-toastr';
import { Expense } from '../models/expense.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Bill } from '../models/bill.model';
import { BillDetails } from '../CommonService/billapi.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ReactiveFormsModule,FormArray, FormControl, FormGroup, Validators ,FormBuilder } from '@angular/forms';
import { PageEvent } from "@angular/material";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers:[BillDetails,ExpenseService]
})
export class UsersComponent implements OnInit {
  totalPosts = 0;
  postsPerPage = 3;
  pageSizeOptions = [3];
  userEmail:string;
  editForm:FormGroup;
  finalEx:any[]=[];
  expense:any[]=[];
  newBill:boolean;
  bill:any[]=[];
  pageNationBill:any[]=[];
  isLoading:boolean;
  id:string;
  editId:{index:number,id:string};
  currentProject:Project;
  private curProSub:Subscription;
  cancel:boolean;
  @ViewChild('Expense') payerForm:NgForm;
  reciverArray:String[]=[];
  editReciverArray:String[]=[];
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;

  constructor(private projectService:ProjectService,
    private route: ActivatedRoute,public billservice:BillDetails,
    private expenseService:ExpenseService,public dialog:MatDialog,private fb:FormBuilder,
    private router: Router,private toastr: ToastrService) { }

    onChangedPage(pageData: PageEvent){
      this.isLoading=true;
      let startIndex:number=+pageData.pageIndex*3;
      let endIndex:number=+startIndex+3;
      let cloneBill=this.bill.slice();
      this.pageNationBill=cloneBill.splice(startIndex,endIndex);
       this.isLoading=false;
    }


    onEdit(id:number){
      let editProject=this.bill[id];
      this.editId={index:id,id:editProject._id};
      this.editForm=this.fb.group({
        BillName:new FormControl(editProject.name, [Validators.required]),
        Payer:new FormControl(editProject.payer, [Validators.required]),
        Amount:new FormControl(editProject.amount, [Validators.required]),
        To:new FormControl(null,[Validators.required])
      });
       let dialogReff = this.dialog.open(this.callAPIDialog);
      }

      onEditSubmit(){
        const billName=this.editForm.value.BillName;
        const payer=this.editForm.value.Payer;
        const amount=this.editForm.value.Amount;
        const recivers:any[]=this.editReciverArray;
        const billform={
        _id:this.editId.id,
        name:billName,
        payer:payer,
        to:recivers,
        amount:amount
        };
       this.updateBill(billform);
       // this.billservice.updateBill(this.id,billform);
       this.editForm.reset();
       this.isLoading=true;
       this.editReciverArray=[];
      }

      updateBill(billform){
        let removedUsers:string[]=[];
        let billArray=this.currentProject.bills;
        let bill=billArray[this.editId.index];
        let desc=`${this.userEmail} Has EDITED the Bill ${bill.name}
        UPDATED BILLNAME: ${billform.name},
        UPDATED AMOUNT : ${billform.amount},
        TIME OF UPDATE : ${new Date()}`;
        bill.to.forEach(x => {
          if(!billform.to.includes(x)){
            removedUsers.push(x);
          }
        });
        let addedUsers=billform.to.filter(x=>{
          return !(bill.to.includes(x));
        });

        if(addedUsers.length>0){
         desc=`${this.userEmail} Has EDITED the Bill ${bill.name}
         by adding ${addedUsers} to the bill.
         UPDATED BILLNAME: ${billform.name}, UPDATED AMOUNT : ${billform.amount}
         TIME OF UPDATE : ${new Date()}`
        }
        if(removedUsers.length>0){
          desc=`${this.userEmail} Has EDITED the Bill ${bill.name}
          by removing ${removedUsers} from the bill.
          UPDATED BILLNAME: ${billform.name}, UPDATED AMOUNT : ${billform.amount}
          TIME OF UPDATE : ${new Date()}`
        }
        if(addedUsers.length>0 && removedUsers.length>0){
          desc=`${this.userEmail} Has EDITED the Bill ${bill.name}
          by removing ${removedUsers} and by adding ${addedUsers} to the bill.
          UPDATED BILLNAME: ${billform.name}, UPDATED AMOUNT : ${billform.amount}
          TIME OF UPDATE : ${new Date()}`
        }
        let history={
        projectId:this.id,
        action:`BILL: ${bill.name} EDITED`,
        doneBy:this.userEmail,
        description:desc
       }
      this.billservice.updateBill(this.id,billform,history);

      }

  ngOnInit() {
    this.userEmail=localStorage.getItem('email').toLowerCase();
    this.newBill=false;
    this.isLoading=true;
    this.cancel=false;
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.projectService.getCurrentProject(this.id);
        }
      );
       this.getCurrentProject();
         }

       onSubmit(){
       let date=new Date();
       this.newBill=false;
       this.isLoading=true;
         const billName=this.payerForm.value.billname;
         const payer=this.payerForm.value.payer;
         const amount=this.payerForm.value.amount;
         if( amount<0 || isNaN(amount)){
           this.router.navigate(["/Users",this.id]);
           this.toastr.error(`THE AMOUNT ENTERED IS NOT A VALID ONE`, 'TRY AGAIN', {
           timeOut: 3000,
           });
           return;
         }
         let recivers:any[]=this.reciverArray;
         const billform={
         name:billName,
         payer:payer,
         to:recivers,
         amount:amount
      };
      let history={
        projectId:this.id,
        action:`BILL: ${billName} CREATED`,
        doneBy:this.userEmail,
        description:`${this.userEmail} Has created the Bill ${billName}
         on ${date}`
      }
      this.billservice.postBills(this.id,billform,history);
      this.payerForm.reset();
      this.reciverArray=[];
      recivers=[];
    }

     onChange(event){
      const index=this.reciverArray.indexOf(event.target.value);
       if(index==-1) {
        this.reciverArray.push(event.target.value);
        }
      else{
       this.reciverArray.splice(index,1);
       }

      }

     onEditChange(event){
     const index=this.editReciverArray.indexOf(event.target.value);
      if(index==-1) {
       this.editReciverArray.push(event.target.value);
        }
      else{
      this.editReciverArray.splice(index,1);
       }

      }

   onDeleteBill(billId:string){
       this.isLoading=true;
       let billArray=this.currentProject.bills;
       let bill=billArray.filter(p=>{
         return p._id==billId;
       })
       let history={
       projectId:this.id,
       action:`BILL: ${bill[0].name} DELETED`,
       doneBy:this.userEmail,
       description:`${this.userEmail} Has Deleted the Bill ${bill[0].name}
        on ${new Date()}`
     }
     this.billservice.deleteBill(billId,this.id,history);
     if(this.bill.length<=0){
        this.newBill=true;
     }
   }


   getCurrentProject(){
     this.curProSub = this.projectService.getUpdatedCurrentProject().
     subscribe((result:{project:Project})=>{
      this.currentProject=result.project;
      this.bill=this.currentProject.bills;
      let cloneBill=this.bill.slice();
      this.totalPosts=this.bill.length;
      this.pageNationBill=cloneBill.splice(0,3);
      this.isLoading=false;
      if(this.bill.length < 1){
         this.newBill=true;
      }
    });
   }

   onAddNewBill(){
     this.cancel=true;
     this.newBill=true;
   }
   onCancel(){
     this.newBill=false;
     this.cancel=false;
   }

   onGenerateBill(){
     this.isLoading=true;
     this.expense=[];
     const users=this.currentProject.users;
     this.bill.forEach(data => {
         const amount=data.amount;
         const payer=data.payer;
         if (data.to.includes(payer)) {
           const split=amount/(data.to.length);
           data.to.forEach(user => {
             if(user!=payer){
              let exp={
                projectId:this.id,
                name:user,
                to:payer,
                amount:+split.toFixed(2)
              }
              this.expense.push(exp);
            }
           });

           }
           else {
             const split=amount/(data.to.length);
             data.to.forEach(user => {
               if(user!=payer){
                let exp={
                  projectId:this.id,
                  name:user,
                  to:payer,
                  amount:+split.toFixed(2)
                }
                this.expense.push(exp);
              }
             });
           }

     });

          this.generateExpense();
   }

   generateExpense(){

       this.currentProject.users.forEach(user => {
          const ex=this.expense.filter(p=>{
              return p.name==user;
          });

          this.currentProject.users.forEach(reciver => {
                if(!(user==reciver))
                {
                  const individualEx=ex.filter(p=>{
                    return p.to==reciver;
                  });
                   let sum=0;
                   individualEx.forEach(element => {
                     sum=sum+element.amount;
                   });
                  const obj={
                    projectId:this.id,
                    name:user,
                    to:reciver,
                    amount:sum
                  };
                  this.finalEx.push(obj);
                }

          });


       });
         this.expenseService.postExpense(this.finalEx,this.id);
          this.finalEx=[];

     }

     ngOnDestroy(){
       this.curProSub.unsubscribe();

     }
}
