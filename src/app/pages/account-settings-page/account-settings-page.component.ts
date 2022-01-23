import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'account-settings-page',
  templateUrl: './account-settings-page.component.html',
  styleUrls: ['./account-settings-page.component.scss']
})
export class AccountSettingsPageComponent implements OnInit {

  user$: Observable<any>;

  settingList$: BehaviorSubject<any> = new BehaviorSubject([
    {
      icon: 'assets/icons/identification.png',
      label: 'Personal Info',
      url: 'personal-info',
      info: 'Provide personal details and how we can reach you'
    }, 
    {
      icon: 'assets/icons/security.png',
      label: 'Login and security',
      url: 'login-and-security',
      info: 'Update your password and secure your account'
    }, 
    {
      icon: 'assets/icons/company.png',
      label: 'Company',
      url: 'company',
      info: 'Update company info and preferences'
    }, 
    {
      icon: 'assets/icons/users.png',
      label: 'Manage Users',
      url: 'manage-user',
      info: 'Create new user, update user info and status'
    }, 
    {
      icon: 'assets/icons/notification.png',
      label: 'Notifications',
      url: 'manage-user',
      info: 'Choose notification preferences and how you want to be contacted'
    }
  ])

  constructor(
    private user: UserService
  ) { }

  ngOnInit(): void {
    this.user$ = this.user.get();


  }

}
