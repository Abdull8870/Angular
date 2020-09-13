import { Component, OnInit ,Inject} from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-dialogue',
  templateUrl: './dialogue.component.html',
  styleUrls: ['./dialogue.component.css']
})
export class DialogueComponent implements OnInit {


  constructor(private router: Router) {
  }

  ngOnInit(): void {

    setTimeout(() => {
              this.router.navigate(["/home"]);
            }, 3000);
  }


}
