import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketStorePageBrandsComponent } from './market-store-page-brands.component';

describe('MarketStorePageBrandsComponent', () => {
  let component: MarketStorePageBrandsComponent;
  let fixture: ComponentFixture<MarketStorePageBrandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketStorePageBrandsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketStorePageBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
