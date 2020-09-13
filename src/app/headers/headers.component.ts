import { Component, OnInit,ViewChild,TemplateRef } from '@angular/core';
import { Subscription } from "rxjs";
import { AuthService } from '../auth/auth.service';
import { ReactiveFormsModule,FormArray, FormControl, FormGroup, Validators ,FormBuilder } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig} from '@angular/material/dialog';
import { ProjectService } from '../CommonService/projectapi.service';
import { Project } from '../models/project.model';
import { Router } from "@angular/router";

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.css']
})
export class HeadersComponent implements OnInit {
  projects:string[]=[];
  private proSub:Subscription;
  activeProject:Project[]=undefined;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  selectProjectForm:FormGroup;
  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  @ViewChild('noProject') noProject: TemplateRef<any>;


  constructor(private authService:AuthService,private fb:FormBuilder,
  public dialog:MatDialog,private projectServiceapi:ProjectService,private router: Router) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

     }

     onLogout() {
    this.authService.logout();
    }

    onUserClick(){
     this.activeProject=this.projectServiceapi.getProjectId();
     if(this.activeProject.length>0){
     this.activeProject.forEach(element => {
       this.projects.push(element.name);
       });

      this.selectProjectForm=this.fb.group({
      projectName:new FormControl(this.projects[0], [Validators.required]),
      });
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      let dialogRef = this.dialog.open(this.callAPIDialog,dialogConfig);
       }
       else{
         const dialogConfig = new MatDialogConfig();
         dialogConfig.disableClose = true;
         let dialogRef = this.dialog.open(this.noProject,dialogConfig);
       }
      }

      onClick(){
         this.projects=[];
         this.activeProject=undefined;
      }


    onSubmit(){
     const index=this.selectProjectForm.value.projectName;
     const project=this.activeProject[index];
     this.projects=[];
     this.activeProject=undefined;
     this.router.navigate(["/Users",project._id]);
     }

     onCreateProject(){
       this.router.navigate(["/project"]);
     }

}
