import { Component, ContentChild, ContentChildren, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { UiOverlayContentDirective } from './overlay-content.directive'; 

@Component({
  selector: 'ui-overlay',
  template: `
  <ng-template #root>
    <ng-container *ngTemplateOutlet="content.tpl"></ng-container>
  </ng-template>`,
  exportAs: 'uiOverlay',
  styleUrls: ['./overlay.component.scss']
})
export class UiOverlayComponent {

  @ViewChild('root') rootTemplate: TemplateRef<any>;

  @ContentChild(UiOverlayContentDirective) content: UiOverlayContentDirective;

}
