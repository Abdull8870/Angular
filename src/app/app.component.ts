import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth/auth.service';
import { WebsocketsService } from './websockets.service'
import { ProjectService } from './CommonService/projectapi.service';
import { BillDetails } from './CommonService/billapi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService:AuthService,private websocketsService:WebsocketsService,
  private projectServiceapi:ProjectService,private billService:BillDetails) {}

  ngOnInit() {
      const email=localStorage.getItem('email').toLowerCase();
      this.websocketsService.listen('test').subscribe(result=>{
        console.log(result);
              });
      this.authService.autoAuthUser();
      this.projectServiceapi.getLiveProjects(email);
      this.projectServiceapi.getLiveDeleteProject(email);
      this.billService.getLiveBills(email);
      this.billService.getLiveUpdatedBills(email);
      this.billService.getLiveDeteleBills(email);
  }
}
