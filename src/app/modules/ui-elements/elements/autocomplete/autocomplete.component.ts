import { Component, ContentChild, ContentChildren, ElementRef, QueryList, TemplateRef, ViewChild } from '@angular/core';

import { switchMap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { UiAutocompleteContentDirective } from './autocomplete-content.directive';
import { UiAutocompleteOptionComponent } from './autocomplete-option/autocomplete-option.component';
import { CdkPortalOutlet } from '@angular/cdk/portal';

@Component({
  selector: 'ui-autocomplete',
  template: `
    <ng-template #root>
      <div class="__autocomplete">
        <ng-container *ngTemplateOutlet="content.tpl"></ng-container>
      </div>
    </ng-template>
    <div #outletWrapper>
      <ng-template cdkPortalOutlet></ng-template>
    </div>
  `,
  exportAs: 'autoComplete',
  styleUrls: ['./autocomplete.component.scss']
})
export class UiAutocompleteComponent {
  @ViewChild('root') rootTemplate: TemplateRef<any>;
  @ViewChild('outletWrapper') outletWrapper: ElementRef<any>;
  @ViewChild(CdkPortalOutlet, { static: true }) portalOutlet: CdkPortalOutlet;

  @ContentChild(UiAutocompleteContentDirective) content: UiAutocompleteContentDirective;
  @ContentChildren(UiAutocompleteOptionComponent) options: QueryList<UiAutocompleteOptionComponent>;

  optionsClick() {
    return this.options.changes.pipe(
      switchMap(options => {
        console.log('options');
        const clicks$ = options.map((option: any) => option.click$);
        return merge(...clicks$);
      })
    );
  }


}
