
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { debounce, debounceTime, filter, map, skip, switchMap, take } from 'rxjs/operators';
import { StoreStatus } from 'src/app/interfaces/interfaces';
import { CompanyService } from 'src/app/services/company.service';
import { StoreService } from 'src/app/services/store.service';

@UntilDestroy()
@Component({
  selector: 'account-store-page-management',
  templateUrl: './account-store-page-management.component.html',
  styleUrls: ['./account-store-page-management.component.scss']
})
export class AccountStoreManagementPageComponent implements OnInit, OnDestroy {

  tabs$: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  title$: Observable<any>;
  ready$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: StoreService,
    private company: CompanyService,
  ) { }

  ngOnInit(): void {

    this.ready$ = this.route.params.pipe(
      switchMap(params => {
        if (params.store_url) {
          return this.store.get();
        }
        return of(true);
      })
    );

    this.title$ = this.store.get().pipe(
      map(store => {
        if (store) {
          return store.name;
        }
        return 'New Store';
      })
    );

    this.store.get().pipe(
      untilDestroyed(this)
    ).subscribe(store => {
      let tabs: Array<any> = [];
      tabs.push({
        label: 'Basic Info',
        link: ['store-info']
      });

      if (store) {
        tabs.push({
          label: 'Brands',
          link: ['brands']
        });
        tabs.push({
          label: 'Products',
          link: ['products']
        });
      }

      this.tabs$.next(tabs);
    })

  }

  ngOnDestroy(): void { }

}
