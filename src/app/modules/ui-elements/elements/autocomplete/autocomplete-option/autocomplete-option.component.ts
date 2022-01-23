import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Component({
  selector: 'ui-autocomplete-option',
  template: `
  <div class="option">
    <ng-content></ng-content>
  </div>
  `,
  styleUrls: ['./autocomplete-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiAutocompleteOptionComponent implements OnInit {

  @Input() value: string;
  click$: Observable<string>;

  constructor(private host: ElementRef) {
  }

  ngOnInit() {
    this.click$ = fromEvent(this.element, 'mousedown').pipe(mapTo(this.value));
  }

  get element() {
    return this.host.nativeElement;
  }

}
