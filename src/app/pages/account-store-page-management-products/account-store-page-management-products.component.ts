import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { StoreService } from 'src/app/services/store.service';

@UntilDestroy()
@Component({
  selector: 'account-store-page-management-products',
  templateUrl: './account-store-page-management-products.component.html',
  styleUrls: ['./account-store-page-management-products.component.scss']
})
export class AccountStoreProductsPageComponent implements OnInit {

  products$: Observable<any>;

  constructor(
    private store: StoreService,
    private product: ProductService
  ) { }

  ngOnInit(): void {
    this.store.get().pipe(
      untilDestroyed(this)
    ).subscribe(store => {
      if (!store) return;
      this.products$ = this.product.list({ 'storefront.id': store._id.toString() }, {}, (e: any) => {
        if (!e.hasOwnProperty('event')) return true;
        if (store._id.toString() == e.event.fullDocument.storefront.id) return true;
        return false;
      });

    });
  }

  ngOnDestroy(): void {
    this.product.unsubscribeList();
  }

}
