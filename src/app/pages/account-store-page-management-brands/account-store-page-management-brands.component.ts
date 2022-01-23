import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';
import { BrandService } from 'src/app/services/brand.service';
import { StoreService } from 'src/app/services/store.service';

@UntilDestroy()
@Component({
  selector: 'account-store-page-management-brands',
  templateUrl: './account-store-page-management-brands.component.html',
  styleUrls: ['./account-store-page-management-brands.component.scss'],
})
export class AccountStoreBrandsPageComponent implements OnInit {

  brands$: Observable<any>;

  constructor(
    private store: StoreService,
    private brand: BrandService
  ) { }

  ngOnInit(): void {
    this.store.get().pipe(
      untilDestroyed(this)
    ).subscribe(store => {
      if (!store) return;
      this.brands$ = this.brand.list({ 'storefront.id': store._id.toString() }, (e: any) => {
        if (!e.hasOwnProperty('event')) return true;
        if (store._id.toString() == e.event.fullDocument.storefront.id) return true;
        return false;
      });

      this.brands$.pipe(untilDestroyed(this)).subscribe(e => console.log('brands >>>', e));
    });
  }

  ngOnDestroy(): void {
    this.brand.unsubscribeList();
  }



}
