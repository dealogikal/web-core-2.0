import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StoreService } from 'src/app/services/store.service';

@UntilDestroy()
@Component({
  selector: 'market-store-page',
  templateUrl: './market-store-page.component.html',
  styleUrls: ['./market-store-page.component.scss']
})
export class MarketStorePageComponent implements OnInit {

  store$: Observable<any>;
  tabs$: BehaviorSubject<any> = new BehaviorSubject([
    {
      label: 'Store',
      link: ['products']
    },
    {
      label: 'About us',
      link: ['overview']
    },
    {
      label: 'Brands',
      link: ['brands']
    },
    {
      label: 'Documents',
      link: ['documents']
    }
  ]);

  constructor(
    private route: ActivatedRoute,
    private store: StoreService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      untilDestroyed(this),
      switchMap(params => this.store.get({ url: params.store_url }))
    ).subscribe();

    this.store$ = this.store.get();
  }



  ngOnDestroy(): void {
    this.store.unsubscribeStream();
  }

}
