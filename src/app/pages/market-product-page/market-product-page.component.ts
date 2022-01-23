import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { skip, switchMap, take } from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';
import { StoreService } from 'src/app/services/store.service';

@UntilDestroy()
@Component({
  selector: 'market-product-page',
  templateUrl: './market-product-page.component.html',
  styleUrls: ['./market-product-page.component.scss']
})
export class MarketProductPageComponent implements OnInit {

  product$: Observable<any>;
  store$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: StoreService,
    private product: ProductService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      untilDestroyed(this),
      switchMap(params => this.product.get({ url: params.product_url }).pipe(skip(1), take(1))),
      switchMap(product => this.store.get({ url: product.storefront.url }).pipe(skip(1), take(1)))
    ).subscribe();

    this.product$ = this.product.get();
    
    this.store$ = this.store.get();

  }

  ngOnDestroy(): void {
  }

}
