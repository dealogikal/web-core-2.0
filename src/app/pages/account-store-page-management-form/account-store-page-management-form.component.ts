import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, filter, map, skip, take } from 'rxjs/operators';
import { CompanyService } from 'src/app/services/company.service';
import { StoreService } from 'src/app/services/store.service';
import { UserService } from 'src/app/services/user.service';

@UntilDestroy()
@Component({
  selector: 'account-store-page-management-form',
  templateUrl: './account-store-page-management-form.component.html',
  styleUrls: ['./account-store-page-management-form.component.scss']
})
export class AccountStoreFormComponent implements OnInit {

  form: FormGroup;
  store$: Observable<any>;
  hasChanged$: Observable<any>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private user: UserService,
    private store: StoreService,
    private company: CompanyService
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      logo: this.formBuilder.group({
        id: '',
        url: '',
        created_at: '',
      }),
      visual_medium: this.formBuilder.array([]),
      documents: this.formBuilder.array([]),
    });

  }

  ngOnInit(): void {

    this.store$ = this.store.get();

    this.hasChanged$ = combineLatest([
      this.store.get(),
      this.form.valueChanges
    ]).pipe(
      untilDestroyed(this),
      debounceTime(100),
      map(([a, b]) => {
        if (!a) return true;
        const { _id, company, status, url, brands, products, ..._a } = a;
        console.log(_a, b);
        return JSON.stringify(_a) !== JSON.stringify(b);
      })
    );

    this.store.get().pipe(
      untilDestroyed(this),
    ).subscribe(store => {
      if (store) {
        this.images.clear();
        this.documents.clear();
        this.form.controls.logo.patchValue(store.logo);
        this.form.controls.name.patchValue(store.name);
        this.form.controls.description.patchValue(store.description);
        store.visual_medium.forEach((media: any) => {
          this.addImage(media);
        });
        store.documents.forEach((document: any) => {
          this.addDocument(document);
        });
      }
    });

  }

  ngOnDestroy(): void { }

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

  get documents(): FormArray {
    return this.form.controls.documents as FormArray;
  }

  addDocument(document: any): void {
    this.documents.push(this.createDocument(document));
  }

  removeDocument(index: number): void {
    this.documents.removeAt(index);
  }

  createDocument(document: any): FormGroup {
    return this.formBuilder.group({
      id: document.asset_id || document.id,
      url: document.secure_url || document.url,
      created_at: document.created_at
    });
  }

  onUploadLogo(image: any): void {
    this.form.controls.logo.patchValue({
      id: image.asset_id,
      url: image.secure_url,
      created_at: image.created_at
    });
  }

  onUploadImage(image: any): void {
    this.addImage(image);
  }

  onUploadDocument(document: any): void {
    this.addDocument(document);
  }

  onDeleteImage(index: any): void {
    this.removeImage(index);
  }

  onDeleteDocument(index: any): void {
    this.removeDocument(index);
  }

  onSubmit() {
    combineLatest([
      this.user.get(),
      this.store.get(),
    ]).pipe(
      take(1),
    ).subscribe(([user, store]) => {
      console.log('submit >>>', this.form.value, store);
      if (!store) {
        store = this.form.value;
        store.company = user.company;
        this.store.create(store).pipe(take(1)).subscribe(res => {
          this.router.navigate([`../../${res.data.url}/management/store-info`], { relativeTo: this.route });
        });
        return;
      }

      Object.assign(store, this.form.value);

      store._id = store._id.toString();

      this.store.update(store).pipe(take(1)).subscribe((res) => {
        console.log('res store update >>>', res);
      });


    });
  }



}
