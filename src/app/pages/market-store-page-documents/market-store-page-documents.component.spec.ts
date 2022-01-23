import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketStorePageDocumentsComponent } from './market-store-page-documents.component';

describe('MarketStorePageDocumentsComponent', () => {
  let component: MarketStorePageDocumentsComponent;
  let fixture: ComponentFixture<MarketStorePageDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketStorePageDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketStorePageDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
