import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { History } from '../models/history.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";

const BACKEND_URL = environment.apiUrl + "/history/";

@Injectable({ providedIn: "root" })
export class HistoryService {

  private updatedHistory = new Subject<{history:History[]}>();
  private history:History[];
  constructor(private http: HttpClient,
  private toastr: ToastrService, private router: Router) {}

  getHistoryasObservable(){
    return this.updatedHistory.asObservable();
  }

  getHistory(id:string) {

    const queryParams =`?projectId=${id}`;
    this.http.get<{ message: string; history: History[]}>(
        BACKEND_URL + queryParams)
      .subscribe(responseData => {
        this.history=responseData.history;
        this.updatedHistory.next({history:[...this.history]});

      },error=>{
        this.toastr.error(`${error.error.message}`, 'AN ERROR OCCURED', {
        timeOut: 3000,
        });
        this.router.navigate(["/"]);

      });
  }

  deleteHistory(projectId:string){

   return this.http.delete<{ message: string}>(BACKEND_URL+projectId)
        }


}
