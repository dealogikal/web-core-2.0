import { Component, ElementRef, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, fromEvent, Observable, of, Subscription } from 'rxjs';
import { distinctUntilChanged, map, pairwise, switchMap, take } from 'rxjs/operators';
import { UiOverlay } from 'src/app/modules/ui-elements/elements/overlay/overlay.service';
import { UserService } from 'src/app/services/user.service';
import { LoginComponent } from '../../access-login-page/login.component';

@UntilDestroy()
@Component({
  selector: 'dealo-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input()
  set fixed(value: boolean) {
    this.__fixed = value;
  }

  @Input()
  set expandOnTop(value: boolean) {
    this.expandOnTop$.next(value);
  }

  @Input()
  set collapseOnStart(value: boolean) {
    if (value) this.collapse = true;
    this.collapseOnStart$.next(value);
  }

  @Input() typeahead: boolean = true;

  @HostBinding('class.__fixed') __fixed: boolean = true;
  @HostBinding('class.__collapse') collapse: boolean;
  @HostBinding('class.__expand') expand: boolean;

  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    const clickTarget = event.target as HTMLElement; 
    const notOrigin = this.host.nativeElement.contains(clickTarget) === false;
    if (notOrigin) {
      this.collapse = true;
      this.expand = false;
    }
  }

  expandOnTop$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  collapseOnStart$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  scrollCollapse$: Observable<boolean>;

  hasAuth$: Observable<boolean>;
  $collapse: Subscription;
  $initCollapse: Subscription;

  constructor(
    private router: Router,
    private user: UserService,
    private uiOverlay: UiOverlay,
    private host: ElementRef,
  ) { }

  ngOnInit(): void {

    this.hasAuth$ = this.user.hasAuth();

    combineLatest([
      of(window.pageYOffset),
      this.collapseOnStart$
    ]).pipe(
      untilDestroyed(this),
      take(1),
      switchMap(([offset, collapseOnStart]) => {
        if (collapseOnStart) return of(true);
        return offset == 0 ? of(false) : of(true);
      })
    ).subscribe((e) => {
      this.collapse = e;
    });

    this.scrollCollapse$ = fromEvent(window, 'scroll').pipe(
      distinctUntilChanged(),
      map(() => window.pageYOffset),
      pairwise(),
      switchMap((p: any) => {
        const y2 = p[1];
        return y2 == 0 ? of(false) : of(true);
      })
    );

    this.$collapse = combineLatest([
      this.scrollCollapse$,
      this.expandOnTop$
    ]).subscribe(([scrollCollapse, expandOnTop]) => {
      if (!expandOnTop) return;
      this.collapse = scrollCollapse;
      this.expand = false;
    });

  }

  ngOnDestroy(): void { }

  onLogin(): void {
    this.uiOverlay.append(LoginComponent);
  }

  onStartHandler(): void {
    console.log('onStartHandler receive')
    this.collapse = false;
    this.expand = true;
  }

  onLogout(): void {
    this.user.logout().pipe(take(1)).subscribe(() => {
      this.router.navigate(['/']);
    })
  }

}
