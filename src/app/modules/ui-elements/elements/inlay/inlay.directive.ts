import { Directive, ElementRef, Input, Renderer2, ViewContainerRef } from '@angular/core';
import { UiInlayComponent } from './inlay.component';
import { fromEvent } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { TemplatePortal } from '@angular/cdk/portal';
import { UiInlay } from './inlay.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Directive({
  selector: '[uiInlay]'
})
export class UiInlayDirective {

  @Input() inlay: UiInlayComponent;

  constructor(
    private host: ElementRef<HTMLInputElement>,
    private vcr: ViewContainerRef,
    private uiInlay: UiInlay,
  ) { }


  ngOnInit() {
    fromEvent(this.origin, 'click').pipe(
      untilDestroyed(this),
      filter(() => !this.inlay.portalOutlet.hasAttached())
    ).subscribe(() => {
      this.openDropdown();
      this.inlay.onClose().pipe(
        untilDestroyed(this)
      ).subscribe((value: any) => {
        console.log('weew', value);
        this.close();
      });
    });

    this.uiInlay.onClose().pipe(
      untilDestroyed(this)
    ).subscribe(() => {
      this.close();
    });

  }

  ngOnDestroy() {

  }

  get origin() {
    return this.host.nativeElement;
  }

  openDropdown() {
    const template: TemplatePortal = new TemplatePortal(this.inlay.rootTemplate, this.vcr);
    this.inlay.portalOutlet.attachTemplatePortal(template);
    this.clickOutside(this.inlay.outletWrapper, this.origin).subscribe(() => this.close());
  }

  close() {
    this.inlay.portalOutlet.detach()
  }

  clickOutside(inlayRef: ElementRef, origin: HTMLElement) {
    return fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter(event => {
          const clickTarget = event.target as HTMLElement;
          const notOrigin = clickTarget !== origin; // the input
          const notOverlay = !!inlayRef && (inlayRef.nativeElement.contains(clickTarget) === false); // the autocomplete
          return notOrigin && notOverlay;
        }),
      )
  }

}



