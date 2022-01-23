import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {


  constructor(
    private user: UserService
  ) { }

  ngOnInit(): void {
    // this.user.get().subscribe(e => console.log('wewe', e));
  }

}
