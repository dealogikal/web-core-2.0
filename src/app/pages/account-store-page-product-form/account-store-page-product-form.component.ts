import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { debounceTime, map, skip, switchMap, take } from 'rxjs/operators';
import { UiInlay } from 'src/app/modules/ui-elements/elements/inlay/inlay.service';
import { BrandService } from 'src/app/services/brand.service';
import { MarketService } from 'src/app/services/markets.service';
import { ProductService } from 'src/app/services/product.service';
import { StoreService } from 'src/app/services/store.service';

@UntilDestroy()
@Component({
  selector: 'account-store-page-product-form',
  templateUrl: './account-store-page-product-form.component.html',
  styleUrls: ['./account-store-page-product-form.component.scss']
})
export class AccountStoreProductFormComponent implements OnInit {

  ready$: Observable<any>;
  title$: Observable<any>;
  product$: Observable<any>;
  hasChanged$: Observable<any>;

  form: FormGroup;

  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  saving$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private store: StoreService,
    private brand: BrandService,
    private product: ProductService,
    private market: MarketService,
    private inlay: UiInlay
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      visual_medium: this.formBuilder.array([]),
      specifications: this.formBuilder.array([]),
      category: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    // this.market.create({
    //   parent_id: '61f7c09a7ff2b17b4a705c88',
    //   type: 'product',
    //   value: 'Unleaded Gasoline'
    // }).pipe(take(1)).subscribe(e => console.log('test create market entry >>>', e));

    this.market.tree().pipe(take(1)).subscribe(e => console.log('test market tree >>>', e));

    this.route.params.pipe(
      untilDestroyed(this),
      switchMap(params => {
        if (params.product_url) {
          return this.product.get({ url: params.product_url }, {}, (e: any) => {
            if (!e.hasOwnProperty('event')) return true;
            if (params.product_url == e.event.fullDocument.url) return true;
            return false;
          }).pipe(skip(1), take(1), map(product => ([params, product])));
        }
        return this.product.get().pipe(take(1), map(product => ([params, product])));
      })
    ).subscribe(([params, product]) => {
      if (!product) {
        if (params.product_url) {
          this.router.navigate(['../../new-product'], { relativeTo: this.route });
        }
      }
    });

    this.ready$ = this.route.params.pipe(
      switchMap(params => {
        if (params.product_url) {
          return this.product.get();
        }
        return of(true);
      })
    );

    this.title$ = this.product.get().pipe(
      map(product => {
        if (product) {
          return product.name;
        }
        return 'New Product';
      })
    );

    this.product$ = this.product.get();

    this.hasChanged$ = combineLatest([
      this.product.get(),
      this.form.valueChanges
    ]).pipe(
      untilDestroyed(this),
      debounceTime(100),
      map(([a, b]) => {
        if (!a) return true;
        console.log(a, b);
        const { _id, storefront, brand, status, url, ..._a } = a;
        // console.log('product >>>', JSON.stringify(_a));
        // console.log('form >>>', JSON.stringify(b));
        return JSON.stringify(_a) !== JSON.stringify(b);
      })
    );

    this.product.get().pipe(
      untilDestroyed(this)
    ).subscribe(product => {
      if (product) {
        this.images.clear();
        this.specs.clear();
        this.form.controls.name.patchValue(product.name);
        this.form.controls.category.patchValue(product.category);
        this.form.controls.description.patchValue(product.description);
        product.visual_medium.forEach((media: any) => {
          this.addImage(media);
        });
        product.specifications.forEach((spec: any) => {
          this.addSpec(spec);
        });
      }
    });

  }

  ngOnDestroy(): void {
    this.product.unsubscribe();
  }
  // start visual medium 
  get images(): FormArray {
    return this.form.controls.visual_medium as FormArray;
  }

  addImage(image: any): void {
    this.images.push(this.createImage(image));
  }

  removeImage(index: number): void {
    this.images.removeAt(index);
  }

  createImage(image: any): FormGroup {
    return this.formBuilder.group({
      id: image.asset_id || image.id,
      url: image.secure_url || image.url,
      created_at: image.created_at
    });
  }

  onUploadImage(image: any): void {
    this.addImage(image);
  }
  // end visual medium 

  // start specifications
  get specs(): FormArray {
    return this.form.controls.specifications as FormArray;
  }

  addSpec(spec: any): void {
    this.specs.push(this.createSpec(spec));
  }

  removeSpec(index: number): void {
    this.specs.removeAt(index);
  }

  createSpec(spec: any): FormGroup {
    return this.formBuilder.group({
      name: spec ? spec.name : '',
      description: spec ? spec.description : ''
    });
  }
  // end specifications

  drop(event: CdkDragDrop<string[]>) {
    moveItemInFormArray(this.specs, event.previousIndex, event.currentIndex);
  }

  onDeleteImage(index: any): void {
    this.removeImage(index);
  }

  onSaveHandler(category: any) {
    this.saving$.next(true);
    this.form.controls.category.patchValue(category);
    this.product.get().pipe(take(1)).subscribe(product => {
      if (product) {
        this.product.update({ _id: product._id.toString(), category: category }).pipe(take(1)).subscribe((e) => {
          console.log('update category',e);
          this.saving$.next(false);
          // this.inlay.close();
        });
      }
    });

  }

  onSubmit() {
    this.saving$.next(true);
    combineLatest([
      this.product.get(),
      this.store.get(),
    ]).pipe(
      take(1),
    ).subscribe(([product, store]) => {
      console.log('submit >>>', this.form.value, product);
      // return;
      if (!product) {
        product = this.form.value;
        product.storefront = {
          id: store._id.toString(),
          name: store.name,
          url: store.url
        };
        this.product.create(product).pipe(take(1)).subscribe(res => {
          this.saving$.next(false);
          this.router.navigate([`../product/${res.data.url}`], { relativeTo: this.route });
        });
        return;
      }

      Object.assign(product, this.form.value);

      product._id = product._id.toString();

      this.product.update(product).pipe(take(1)).subscribe((res) => {
        this.saving$.next(false);
      });

    });

  }

}


export function moveItemInFormArray(formArray: FormArray, fromIndex: number, toIndex: number): void {
  const dir = toIndex > fromIndex ? 1 : -1;

  const from = fromIndex;
  const to = toIndex;

  const temp = formArray.at(from);
  for (let i = from; i * dir < to * dir; i = i + dir) {
    const current = formArray.at(i + dir);
    formArray.setControl(i, current);
  }
  formArray.setControl(to, temp);
}
