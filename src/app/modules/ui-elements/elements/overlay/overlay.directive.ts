import { Directive, ElementRef, Input, Renderer2, ViewContainerRef } from '@angular/core';
import { UiOverlayComponent } from './overlay.component';
import { fromEvent } from 'rxjs';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { TemplatePortal } from '@angular/cdk/portal';
import { UiOverlay } from './overlay.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Directive({
  selector: '[uiOverlay]'
})
export class UiOverlayDirective {

  @Input() overlay: UiOverlayComponent;
  private overlayRef: OverlayRef;

  constructor(
    private host: ElementRef<HTMLInputElement>,
    private vcr: ViewContainerRef,
    private _overlay: Overlay,
    private uiOverlay: UiOverlay
  ) { }

  ngOnInit() {
    fromEvent(this.origin, 'mouseup').pipe(
      untilDestroyed(this)
    ).subscribe(() => {
      this.openDropdown();
    });

    // this.uiOverlay.onClose().pipe(
    //   untilDestroyed(this)
    // ).subscribe(() => {
    //   this.close();
    // });
    
  }

  openDropdown() {
    this.overlayRef = this._overlay.create({
      hasBackdrop: true,
      positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this._overlay.scrollStrategies.block(),
    });

    const template = new TemplatePortal(this.overlay.rootTemplate, this.vcr);

    this.overlayRef.attach(template);

    this.overlayClickOutside(this.overlayRef, this.origin).subscribe(() => this.close());
  }

  ngOnDestroy() { }

  close() {
    if (!this.overlayRef) return;
    this.overlayRef.detach();
    this.overlayRef = null;
  }

  get origin() {
    return this.host.nativeElement;
  }

  overlayClickOutside(overlayRef: OverlayRef, origin: HTMLElement) {
    return fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter(event => {
          const clickTarget = event.target as HTMLElement;
          const notOrigin = clickTarget !== origin; // the input
          const notOverlay = !!overlayRef && (overlayRef.overlayElement.contains(clickTarget) === false); // the autocomplete
          return notOrigin && notOverlay;
        }),
        takeUntil(overlayRef.detachments())
      )
  }

}



