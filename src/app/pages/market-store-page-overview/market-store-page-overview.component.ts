import { Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';

@UntilDestroy()
@Component({
  selector: 'market-store-page-overview',
  templateUrl: './market-store-page-overview.component.html',
  styleUrls: ['./market-store-page-overview.component.scss']
})
export class MarketStoreOverviewPageComponent implements OnInit {

  store$: Observable<any>;

  constructor(
    private store: StoreService
  ) { }

  ngOnInit(): void {
    this.store$ = this.store.get();
  }


  ngOnDestroy(): void { }

}
