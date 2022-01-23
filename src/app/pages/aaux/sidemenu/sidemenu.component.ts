import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {

  user$: Observable<any>;

  menuList$: BehaviorSubject<any> = new BehaviorSubject([
    {
      icon: 'assets/icons/account-outline.svg',
      label: 'Account'
    }, 
    {
      icon: 'assets/icons/store.svg',
      label: 'Store Management'
    }
  ])

  constructor() { }

  ngOnInit(): void {
  }

}
