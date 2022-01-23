import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, filter, map, skip, switchMap, take } from 'rxjs/operators';
import { CompanyService } from 'src/app/services/company.service';
import { StoreService } from 'src/app/services/store.service';
import { UserService } from 'src/app/services/user.service';


@UntilDestroy()
@Component({
  selector: 'store-page',
  templateUrl: './account-store-page.component.html',
  styleUrls: ['./account-store-page.component.scss']
})
export class AccountStorePageComponent implements OnInit, OnDestroy {

  company$: Observable<any>;
  store$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private user: UserService,
    private store: StoreService,
    private company: CompanyService,
  ) { }

  ngOnInit(): void {

    combineLatest([
      this.company.get().pipe(filter(company => company)),
      this.route.params
    ]).pipe(
      untilDestroyed(this),
      debounceTime(100),
      switchMap(([company, params]) => {
        if (params.store_url) {
          return this.store.get({ url: params.store_url }).pipe(skip(1), take(1), map(store => ([params, store, company])))
        }
        return this.store.get().pipe(take(1), map(store => ([params, store, company])))
      }),
    ).subscribe(([params, store, company]) => {
      if (params.store_url && !store) {
        if (company.storefronts.length) {
          this.router.navigate([`/account/store/${company.storefronts[0].url}/management/store-info`]);
        } else {
          this.router.navigate([`/account/store/management/new-store`]);
        }
      }
      if (!params.store_url && company) {
        if (company.storefronts.length) {
          this.router.navigate([`/account/store/${company.storefronts[0].url}/management/store-info`]);
        } else {
          this.router.navigate([`/account/store/management/new-store`]);
        }
      }
    });



  }

  ngOnDestroy(): void {
    console.log('on destroy');
    this.store.unsubscribeStream();
  }

}
