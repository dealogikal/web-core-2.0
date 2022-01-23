import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { UiOverlay } from 'src/app/modules/ui-elements/elements/overlay/overlay.service';
import { UserService } from 'src/app/services/user.service';
import { UiInlay } from 'src/app/modules/ui-elements/elements/inlay/inlay.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  error$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private user: UserService,
    private uiOverlay: UiOverlay,
    private formBuilder: FormBuilder,
    private uiInlay: UiInlay
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    });

  }

  ngOnInit(): void {

    combineLatest([
      this.form.valueChanges,
      this.error$.pipe(filter(e => !!e)),
    ]).pipe(
      untilDestroyed(this)
    ).subscribe(() => {
      this.error$.next('');
    });

  }

  ngOnDestroy(): void { }

  onClose(): void {
    this.uiOverlay.close();
  }

  onSubmit(): void {
    console.log('submit')
    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key).markAsTouched();
        this.form.get(key).markAsDirty();
      });
      return;
    }

    this.user.login(this.form.value).subscribe(e => {
      if (e.error) {
        this.error$.next(e.error.error);
        return;
      }
      this.uiOverlay.close();
    });

  }

}
