import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Project } from "../models/project.model";
import { Bill } from '../models/bill.model';
import { WebsocketsService } from '../websockets.service';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from './projectapi.service';
import { Router } from "@angular/router";

const BACKEND_URL = environment.apiUrl + "/bill";

@Injectable({ providedIn: "root" })
export class BillDetails {


  private bill:Bill[];
  constructor(private http: HttpClient,
    private websocketsService:WebsocketsService,private toastr: ToastrService,
    private projectService:ProjectService,private router: Router) {}


  postBills(id:string,bill:any,history:any) {
    const data={
      projectId:id,
      bill:bill,
      history:history
    };
    this.http
      .post<{ message: string; bill: Project }>(
        BACKEND_URL,
        data
      )
      .subscribe(responseData => {
        this.bill=responseData.bill.bills;
        this.projectService.getCurrentProject(id);
      },error=>{
        this.router.navigate(["/project"]);
        this.toastr.error(`${error.error.message}`, 'AN ERROR OCCURED', {
        timeOut: 3000,
        });
      });
  }

  deleteBill(billId:string,projectId:string,history){
    const data={
      billId:billId,
      projectId:projectId,
      history:history
    };
    this.http
      .post<{ message: string; bill: Project}>(
        BACKEND_URL+'/delete',
        data
      )
      .subscribe(responseData => {
        this.bill=responseData.bill.bills;
        this.projectService.getCurrentProject(projectId);
      },error=>{
        this.router.navigate(["/project"]);
        this.toastr.error(`${error.error.message}`, 'AN ERROR OCCURED', {
        timeOut: 3000,
        });
      });
  }

  updateBill(projectId:string,bill:Bill,history:any){
    const data={
      billId:bill._id,
      projectId:projectId,
      bill:bill,
      history:history
    };
    this.http
      .put<{ message: string; bill: Project}>(
        BACKEND_URL+'/update',
        data
      )
      .subscribe(responseData => {
        this.bill=responseData.bill.bills;
        this.projectService.getCurrentProject(projectId);
      },error=>{
        this.router.navigate(["/project"]);
        this.toastr.error(`${error.error.message}`, 'AN ERROR OCCURED', {
        timeOut: 3000,
        });
      });
  }

  getLiveBills(email:string){

    this.websocketsService.listenLiveBills().
    subscribe((result:{action:string,
      email:string[],
      project:Project,
      projectId:string,
      projectName:string,
      by:string})=>{
        if((result.email.includes(email))){
        this.toastr.info( `BY ${result.by}`,`NEW BILL HAS BEEN ADDED TO THE PROJECT ${result.projectName}`);
        this.projectService.getCurrentProject(result.projectId);
      }
    });
  }

  getLiveUpdatedBills(email:string){
    this.websocketsService.listenLiveUpdateBills().
    subscribe((result:{action:string,
      email:string[],
      project:Project,
      projectId:string,
      projectName:string,
      by:string})=>{
        if((result.email.includes(email))){
        this.toastr.info( `BY ${result.by}`,`A BILL HAS BEEN UPDATED IN THE PROJECT ${result.projectName}`);
        this.projectService.getCurrentProject(result.projectId);
      }
    },error=>{
      this.toastr.error(`${error.error.message}`, 'AN ERROR OCCURED', {
      timeOut: 3000,
      });
    });
  }

  getLiveDeteleBills(email:string){
    this.websocketsService.listentoDeleteBill().subscribe((result:{action:string,
      email:string[],
      project:Project,
      projectId:string,
      projectName:string,
      by:string})=>{
      if((result.email.includes(email))){
      this.toastr.info( `BY ${result.by}`,`A BILL HAS BEEN DELETED IN THE PROJECT ${result.projectName}`);
      this.projectService.getCurrentProject(result.projectId);
    }
  },error=>{
    this.toastr.error(`${error.error.message}`, 'AN ERROR OCCURED', {
    timeOut: 3000,
    });
  });
  }


}
