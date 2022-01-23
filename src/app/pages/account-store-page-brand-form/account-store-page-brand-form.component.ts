import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BSON } from 'realm-web';
import { combineLatest, Observable, of } from 'rxjs';
import { debounceTime, map, skip, switchMap, take } from 'rxjs/operators';
import { BrandService } from 'src/app/services/brand.service';
import { StoreService } from 'src/app/services/store.service';

@UntilDestroy()
@Component({
  selector: 'account-store-page-brand-form',
  templateUrl: './account-store-page-brand-form.component.html',
  styleUrls: ['./account-store-page-brand-form.component.scss']
})
export class AccountStoreBrandFormComponent implements OnInit {

  ready$: Observable<any>;
  title$: Observable<any>;
  brand$: Observable<any>;
  hasChanged$: Observable<any>;

  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private store: StoreService,
    private brand: BrandService
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      logo: this.formBuilder.group({
        id: '',
        url: '',
        created_at: '',
      }),
      description: ['', Validators.required],
      visual_medium: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.route.params.pipe(
      untilDestroyed(this),
      switchMap(params => {
        if (params.brand_url) {
          return this.brand.get({ url: params.brand_url }, (e: any) => {
            if (!e.hasOwnProperty('event')) return true;
            if (params.brand_url == e.event.fullDocument.url) return true;
            return false;
          }).pipe(skip(1), take(1), map(brand => ([params, brand])));
        }
        return this.brand.get().pipe(take(1), map(brand => ([params, brand])));
      })
    ).subscribe(([params, brand]) => {
      if (!brand) {
        if (params.brand_url) {
          this.router.navigate(['../../new-brand'], { relativeTo: this.route });
        }
      }
    });


    this.ready$ = this.route.params.pipe(
      switchMap(params => {
        if (params.brand_url) {
          return this.brand.get();
        }
        return of(true);
      })
    );

    this.title$ = this.brand.get().pipe(
      map(brand => {
        if (brand) {
          return brand.name;
        }
        return 'New Brand';
      })
    );

    this.brand$ = this.brand.get();

    this.hasChanged$ = combineLatest([
      this.brand.get(),
      this.form.valueChanges
    ]).pipe(
      untilDestroyed(this),
      debounceTime(100),
      map(([a, b]) => {
        if (!a) return true;
        console.log(a, b);
        const { _id, storefront, status, url, ..._a } = a;
        return JSON.stringify(_a) !== JSON.stringify(b);
      })
    );

    this.brand.get().pipe(
      untilDestroyed(this)
    ).subscribe(brand => {
      if (brand) {
        this.images.clear();
        this.form.controls.logo.patchValue(brand.logo);
        this.form.controls.name.patchValue(brand.name);
        this.form.controls.description.patchValue(brand.description);
        brand.visual_medium.forEach((media: any) => {
          this.addImage(media);
        });
      }
    });

  }

  ngOnDestroy(): void {
    this.brand.unsubscribe();
  }

  onUploadLogo(image: any) {
    console.log('on upload logo', image);
    this.form.controls.logo.patchValue({
      id: image.asset_id,
      url: image.secure_url,
      created_at: image.created_at
    });
  }

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

  onDeleteImage(index: any): void {
    this.removeImage(index);
  }

  onSubmit() {
    combineLatest([
      this.brand.get(),
      this.store.get(),
    ]).pipe(
      take(1),
    ).subscribe(([brand, store]) => {
      console.log('submit >>>', this.form.value, brand);
      if (!brand) {
        brand = this.form.value;
        brand.storefront = {
          id: store._id.toString(),
          name: store.name,
          url: store.url
        };
        this.brand.create(brand).pipe(take(1)).subscribe(res => {
          console.log('created >>>', res);
          this.router.navigate([`../brand/${res.data.url}`], { relativeTo: this.route });
        });
        return;
      }

      Object.assign(brand, this.form.value);

      brand._id = brand._id.toString();

      this.brand.update(brand).pipe(take(1)).subscribe((res) => {
        console.log('res brand update >>>', res);
      });


    });

  }
}
