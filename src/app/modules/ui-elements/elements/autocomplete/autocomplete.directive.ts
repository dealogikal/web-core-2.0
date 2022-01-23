import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { Directive, ElementRef, EmbeddedViewRef, Input, ViewContainerRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fromEvent, of } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { UiAutocompleteComponent } from './autocomplete.component';

@UntilDestroy()
@Directive({
  selector: '[uiAutocomplete]'
})
export class UiAutocompleteDirective {

  @Input() autocomplete: UiAutocompleteComponent;

  constructor(
    private host: ElementRef<HTMLInputElement>,
    private vcr: ViewContainerRef,
  ) { }

  ngOnInit() {
    fromEvent(this.origin, 'focus').pipe(
      untilDestroyed(this),
      filter(() => !this.autocomplete.portalOutlet.hasAttached())
    ).subscribe(() => {
      this.openDropdown();

      this.autocomplete.optionsClick().pipe(
        untilDestroyed(this)
      ).subscribe((value: any) => {
        this.close();
      });
    });
  }

  ngOnDestroy() { }

  get origin() {
    return this.host.nativeElement;
  }

  openDropdown() {
    const template: TemplatePortal = new TemplatePortal(this.autocomplete.rootTemplate, this.vcr);
    this.autocomplete.portalOutlet.attachTemplatePortal(template);

    clickOutside(this.autocomplete.outletWrapper, this.origin).subscribe(() => this.close());
  }

  close() {
    this.autocomplete.portalOutlet.detach();
  }

}


export function clickOutside(autocomplete: ElementRef, origin: HTMLElement) {
  return fromEvent<MouseEvent>(document, 'click')
    .pipe(
      filter(event => {
        const clickTarget = event.target as HTMLElement;
        const notOrigin = clickTarget !== origin; // the input
        const notOverlay = !!autocomplete && (autocomplete.nativeElement.contains(clickTarget) === false); // the autocomplete
        return notOrigin && notOverlay;
      }),
    )
}

