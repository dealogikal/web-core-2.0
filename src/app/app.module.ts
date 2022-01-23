import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component'; 
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UiElementsModule } from './modules/ui-elements/ui-elements.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './pages/aaux/header/header.component';
import { FooterComponent } from './pages/aaux/footer/footer.component';
import { TestimonialsComponent } from './pages/home-page/partials/testimonials/testimonials.component';
import { WhyDealoComponent } from './pages/home-page/partials/why-dealo/why-dealo.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { HttpClientModule } from '@angular/common/http';
import { MarketsComponent } from './pages/home-page/partials/markets/markets.component';
import { TypeAheadComponent } from './pages/aaux/type-ahead/type-ahead.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/access-login-page/login.component';
import { SignUpComponent } from './pages/access-sign-up-page/sign-up.component';
import { ContenteditableValueAccessorModule } from '@tinkoff/angular-contenteditable-accessor';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { SidemenuComponent } from './pages/aaux/sidemenu/sidemenu.component';
import { AccountSettingsPageComponent } from './pages/account-settings-page/account-settings-page.component';
import { AccountStoreBrandsPageComponent } from './pages/account-store-page-management-brands/account-store-page-management-brands.component';
import { AccountStoreFormComponent } from './pages/account-store-page-management-form/account-store-page-management-form.component';
import { AccountStoreBrandFormComponent } from './pages/account-store-page-brand-form/account-store-page-brand-form.component';
import { AccountStorePageComponent } from './pages/account-store-page/account-store-page.component';
import { AccountStoreManagementPageComponent } from './pages/account-store-page-management/account-store-page-management.component';
import { AccountStoreProductsPageComponent } from './pages/account-store-page-management-products/account-store-page-management-products.component';
import { AccountStoreProductFormComponent } from './pages/account-store-page-product-form/account-store-page-product-form.component';
import { MarketStorePageComponent } from './pages/market-store-page/market-store-page.component';
import { MarketProductPageComponent } from './pages/market-product-page/market-product-page.component';
import { MarketPageComponent } from './pages/market-page/market-page.component';
import { MarketStoreOverviewPageComponent } from './pages/market-store-page-overview/market-store-page-overview.component';
import { MarketStoreProductsPageComponent } from './pages/market-store-page-products/market-store-page-products.component';
import { MarketStorePageBrandsComponent } from './pages/market-store-page-brands/market-store-page-brands.component';
import { MarketStorePageDocumentsComponent } from './pages/market-store-page-documents/market-store-page-documents.component';

const PAGES = [
  HomePageComponent,
  LoginComponent,
  SignUpComponent,
  AccountPageComponent,
];

const AUX = [
  HeaderComponent,
  FooterComponent,
  TypeAheadComponent,
  SidemenuComponent
];

const HOMEPAGE = [
  MarketsComponent,
  WhyDealoComponent,
  TestimonialsComponent,
];

const ACCOUNT_PAGE = [
  AccountSettingsPageComponent,
  AccountStorePageComponent,
];

const STORE_MANAGEMENT = [
  AccountStoreManagementPageComponent,
  AccountStoreFormComponent,
  AccountStoreBrandsPageComponent,
  AccountStoreBrandFormComponent,
  AccountStoreProductsPageComponent,
  AccountStoreProductFormComponent,
];

const MARKET = [
  MarketStorePageComponent,
  MarketProductPageComponent,
  MarketPageComponent,
  MarketStoreOverviewPageComponent,
  MarketStoreProductsPageComponent,
]

@NgModule({
  declarations: [
    AppComponent,
    ...PAGES,
    ...AUX,
    ...HOMEPAGE,
    ...ACCOUNT_PAGE,
    ...STORE_MANAGEMENT,
    ...MARKET,
    MarketStorePageBrandsComponent,
    MarketStorePageDocumentsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    ContenteditableValueAccessorModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    DragDropModule,
    InlineSVGModule.forRoot(),
    UiElementsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
