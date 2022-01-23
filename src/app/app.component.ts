import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, filter, map, skip, switchMap, take } from 'rxjs/operators';
import { CompanyService } from './services/company.service';
import { ThemeService } from './services/theme.service';
import { UserService } from './services/user.service';
import { ObjectId } from 'bson';
import { BSON } from 'realm-web';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'web-core-2.0';
  user$: Observable<any>;
  options = [
    {
      label: 'label 1',
      value: 'value 1',
    }
  ]

  constructor(
    private theme: ThemeService,
    private user: UserService,
    private company: CompanyService
  ) {

  }

  ngOnInit(): void {
    this.user$ = this.user.get();

    this.user.auth.pipe(
      untilDestroyed(this),
      filter((user: any) => {
        if (!user) return false;
        return user.providerType == 'anon-user' ? false : true
      }),
      switchMap((auth: any) => {
        return this.user.get({ auth_id: auth.id }).pipe(skip(1), take(1));
      }),
      switchMap((user: any) => {
        return this.company.get({ _id: new BSON.ObjectID(user.company.id) }).pipe(skip(1), take(1));
      })
    ).subscribe(() => {
      console.log('app init >>>');
    });

  }

  ngOnDestroy(): void {
    this.user.unsubscribe();
    this.company.unsubscribe();
  }



}
