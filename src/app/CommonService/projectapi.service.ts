import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Project } from "../models/project.model";
import { WebsocketsService } from '../websockets.service';
import { ToastrService } from 'ngx-toastr';
import { HistoryService } from './history.service';
import { Router } from "@angular/router";

const BACKEND_URL = environment.apiUrl + "/project/";
const BACKEND = environment.apiUrl + "/project/sample";

@Injectable({ providedIn: "root" })
export class ProjectService {
  private currentProject:Project;
  private project: Project[] ;
  private projectUpdated = new Subject<{project:Project[]}>();
  private currentProjectObs=new Subject<{project:Project}>();
  constructor(private http: HttpClient,private websocketsService:WebsocketsService,
    private toastr: ToastrService,
    private historyService:HistoryService,private router: Router) {}

  getCurrentProject(id:string){
    this.http.get<{ message: string; project: Project[]}>(BACKEND_URL + id).
    subscribe(result=>{
      this.currentProject=result.project[0];
      this.currentProjectObs.next({project:this.currentProject})
    },error=>{
      this.toastr.error(`${error.error.message}`, 'AN ERROR OCCURED', {
      timeOut: 3000,
      });
      this.router.navigate(["/home"]);
    });
  }
  getUpdatedCurrentProject(){
    return this.currentProjectObs.asObservable();
  }
  getUpdatedProject(){
    return this.projectUpdated.asObservable();
  }

  addProject(name: string, createdBy: string, users:string[],history:any) {
    const project={
      name:name,
      createdBy:createdBy,
      users:users,
      history:history
    };
    this.http
      .post<{ message: string; post: Project }>(BACKEND_URL,project)
      .subscribe(responseData => {
        this.getProjectEmail();
      },error=>{

        this.router.navigate(["/home"]);
        this.toastr.error(`${error.error.message}`, 'AN ERROR OCCURED', {
        timeOut: 3000,
        });
      });
  }

  deleteProject(postId: string,users:string[],dP:string) {
     const queryParams = `?users=${users}&dp=${dP}`;
     this.http.delete<{message:string}>(BACKEND_URL + postId + queryParams).subscribe(result=>{
      if(result.message==="DELETION SUCCESSFULL!")
      {
        this.historyService.deleteHistory(postId).subscribe(result=>{
         this.toastr.info('This might take few seconds')
          this.getProjectEmail();
        },error=>{
          this.toastr.error(`${error.error.message}`, 'AN ERROR OCCURED', {
          timeOut: 3000,
          });
        });

      }
    },error=>{
      this.router.navigate(["/home"]);
      this.toastr.error(`${error.error.message}`, 'AN ERROR OCCURED', {
      timeOut: 3000,
      });

    });
  }

  getProjectEmail() {

  let _email=localStorage.getItem('email');
  this.http
    .get<{ message: string; project: Project[] }>(
      BACKEND_URL)
    .subscribe(responseData => {
      this.project=responseData.project;
      this.projectUpdated.next({project:[...this.project]});
    },
    error=>{
      this.router.navigate(["/home"]);
      this.toastr.error(`${error.error.message}`, 'AN ERROR OCCURED', {
      timeOut: 3000,
      });
    });
}


    getProjectId(){
      return this.project;
    }

    getLiveProjects(email:string){
      this.websocketsService.listenLiveProjects().
      subscribe((data:{ action:string,
        email:string[],
        name:string,
        by:string})=>{
        if(data.email.includes(email)){
        this.getProjectEmail();
        this.toastr.info( `BY ${data.by}`,`A NEW PROJECT ${data.name} HAS BEEN ADDED`);
      }
    },error=>{
      this.toastr.error(`${error.error.message}`, 'AN ERROR OCCURED', {
      timeOut: 3000,
      });
    });

    }

    getLiveDeleteProject(email:string){
      this.websocketsService.listenLiveDeleteProject().
      subscribe((data:{ action:string,
        email:string[],
        name:string,
        by:string})=>{

        if(data.email.includes(email)){
        this.getProjectEmail();
        this.toastr.info( `BY ${data.by}`,`THE PROJECT ${data.name} HAS BEEN DELETED`);

        }
      },error=>{
        this.toastr.error(`${error.error.message}`, 'AN ERROR OCCURED', {
        timeOut: 3000,
        });
      });
    }


}
