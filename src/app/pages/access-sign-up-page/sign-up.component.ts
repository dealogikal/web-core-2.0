import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  form: FormGroup;

  showBuying$: Observable<any>;
  showSelling$: Observable<any>;

  purposeOfSignupData: Array<any> = [
    {
      label: 'I want to buy products',
      value: 'Buyer'
    },
    {
      label: 'I want to sell products',
      value: 'Seller'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private user: UserService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', Validators.required],
      companyName: ['', Validators.required],
      companyDescription: [''],
      purposeOfSignup: this.formBuilder.array([]),
      demoDate: ['', Validators.required],
      demoTime: ['', Validators.required],
      clientNotes: [''],
      commoditiesBuying: [''],
      commoditiesSelling: ['']
    });

    this.addCheckboxes();

    this.showBuying$ = this.form.controls.purposeOfSignup.valueChanges.pipe(
      map(value => value.map((checked: boolean, i: number) => checked ? this.purposeOfSignupData[i].value : null).filter((v: string) => v !== null).includes('Buyer'))
    );

    this.showSelling$ = this.form.controls.purposeOfSignup.valueChanges.pipe(
      map(value => value.map((checked: boolean, i: number) => checked ? this.purposeOfSignupData[i].value : null).filter((v: string) => v !== null).includes('Seller'))
    );

  }


  get purposeOfSignup(): FormArray {
    return this.form.controls.purposeOfSignup as FormArray;
  }

  private addCheckboxes(): void {
    this.purposeOfSignupData.forEach(() => this.purposeOfSignup.push(new FormControl(false)));
  }

  onSubmit(): void {
    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key).markAsTouched();
        this.form.get(key).markAsDirty();
      });
      return;
    }

    const mappedPurposeOfSignup = this.form.value.purposeOfSignup
      .map((checked: boolean, i: number) => checked ? this.purposeOfSignupData[i].value : null)
      .filter((v: string) => v !== null);
    const mappedDemoSchedule = moment(`${moment(this.form.value.demoDate).format('L')} ${this.form.value.demoTime}`).format();
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const device = isMobile ? 'Mobile' : 'Desktop';

    let { purposeOfSignup, demoDate, demoTime, ...companySignup } = JSON.parse(JSON.stringify(this.form.value));

    companySignup.purposeOfSignup = mappedPurposeOfSignup;
    companySignup.demoSchedule = mappedDemoSchedule;
    companySignup.device = device;

    this.user.signup(companySignup).subscribe(e => {
      console.log('signup', e);
    });
  }

}
