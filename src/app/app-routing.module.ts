import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './pages/access-sign-up-page/sign-up.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RealmAuthGuard } from './realm-auth.guard';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { AccountAuthGuard } from './pages/account-page/account-auth.guard';
import { AccountSettingsPageComponent } from './pages/account-settings-page/account-settings-page.component';
import { AccountStorePageComponent } from './pages/account-store-page/account-store-page.component';
import { AccountStoreBrandFormComponent } from './pages/account-store-page-brand-form/account-store-page-brand-form.component';
import { AccountStoreManagementPageComponent } from './pages/account-store-page-management/account-store-page-management.component';
import { AccountStoreProductFormComponent } from './pages/account-store-page-product-form/account-store-page-product-form.component';
import { MarketStorePageComponent } from './pages/market-store-page/market-store-page.component';
import { MarketPageComponent } from './pages/market-page/market-page.component';
import { MarketStoreOverviewPageComponent } from './pages/market-store-page-overview/market-store-page-overview.component';
import { MarketStoreProductsPageComponent } from './pages/market-store-page-products/market-store-page-products.component';
import { AccountStoreFormComponent } from './pages/account-store-page-management-form/account-store-page-management-form.component';
import { AccountStoreBrandsPageComponent } from './pages/account-store-page-management-brands/account-store-page-management-brands.component';
import { AccountStoreProductsPageComponent } from './pages/account-store-page-management-products/account-store-page-management-products.component';
import { MarketProductPageComponent } from './pages/market-product-page/market-product-page.component';

const routes: Routes = [
  {
    path: "",
    canActivate: [RealmAuthGuard],
    children: [
      {
        path: "",
        component: HomePageComponent,
      },
      {
        path: "sign-up",
        component: SignUpComponent,
      },
      {
        path: "market",
        children: [
          {
            path: "",
            component: MarketPageComponent,
          },
          {
            path: "store",
            redirectTo: "",
          },
          {
            path: "store/:store_url",
            component: MarketStorePageComponent,
            children: [
              {
                path: "",
                pathMatch: "full",
                redirectTo: "overview"
              },
              {
                path: "overview",
                component: MarketStoreOverviewPageComponent
              },
              {
                path: "products",
                component: MarketStoreProductsPageComponent
              }
            ]
          },
          {
            path: "product",
            redirectTo: "",
          },
          {
            path: 'product/:product_url',
            component: MarketProductPageComponent
          }
        ]
      },
      {
        path: "account",
        component: AccountPageComponent,
        canActivate: [AccountAuthGuard],
        children: [
          {
            path: "",
            pathMatch: "full",
            redirectTo: "settings"
          },
          {
            path: "settings",
            component: AccountSettingsPageComponent
          },
          {
            path: "store",
            component: AccountStorePageComponent,
            children: [
              {
                path: "management",
                component: AccountStoreManagementPageComponent,
                children: [
                  {
                    path: "",
                    pathMatch: "full",
                    redirectTo: "new-store"
                  },
                  {
                    path: "new-store",
                    component: AccountStoreFormComponent
                  },
                  {
                    path: "**",
                    redirectTo: "store-info",
                  }
                ]
              },
            ]
          },
          {
            path: "store/:store_url",
            component: AccountStorePageComponent,
            children: [
              {
                path: "management",
                component: AccountStoreManagementPageComponent,
                children: [
                  {
                    path: "",
                    pathMatch: "full",
                    redirectTo: "store-info"
                  },
                  {
                    path: "store-info",
                    component: AccountStoreFormComponent
                  },
                  {
                    path: "brands",
                    component: AccountStoreBrandsPageComponent
                  },
                  {
                    path: "products",
                    component: AccountStoreProductsPageComponent
                  }
                ]
              },
              {
                path: "new-brand",
                component: AccountStoreBrandFormComponent
              },
              {
                path: "brand/:brand_url",
                component: AccountStoreBrandFormComponent
              },
              {
                path: "new-product",
                component: AccountStoreProductFormComponent
              },
              {
                path: "product/:product_url",
                component: AccountStoreProductFormComponent
              }
            ]
          },

        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    paramsInheritanceStrategy: 'always',
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
