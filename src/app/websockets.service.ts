import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
import { Observable } from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class WebsocketsService {
  socket:any;
  BACKEND_URL:string="http://expensesplitterbackend-env.eba-vpaafhyz.us-east-2.elasticbeanstalk.com";

  constructor() {
    this.socket=io(this.BACKEND_URL);
  }

 verifyUser(eventName:string,data:any){
  this.socket.emit(eventName,data);
 }


  listen(eventName:string){
    return new Observable((subscriber)=>{
      this.socket.on(eventName,(data)=>{
        subscriber.next(data);
      })

    });
  }

  emit(eventName:string,data:any){

     this.socket.emit(eventName,data);
  }


  listenLiveProjects(){

    return new Observable((subscriber)=>{
      this.socket.on('createProject',(data)=>{
        subscriber.next(data);
      })

    });
  }

  listenLiveDeleteProject(){

    return new Observable((subscriber)=>{
      this.socket.on('deleteProject',(data)=>{
        subscriber.next(data);
      })

    });
  }

  listenLiveBills(){
    return new Observable((subscriber)=>{
      this.socket.on('billCreate',(data)=>{
        subscriber.next(data);
      })

    });
  }

  listenLiveUpdateBills(){
    return new Observable((subscriber)=>{
      this.socket.on('billUpdate',(data)=>{
        subscriber.next(data);
      })

    });
  }

  listentoDeleteBill(){
    return new Observable((subscriber)=>{
      this.socket.on('billDelete',(data)=>{
        subscriber.next(data);
      })

    });
  }
}
