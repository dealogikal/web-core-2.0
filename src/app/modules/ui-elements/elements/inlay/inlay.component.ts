

import { Component, ContentChild, ContentChildren, ElementRef, QueryList, TemplateRef, ViewChild } from '@angular/core';

import { switchMap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { UiInlayContentDirective } from './inlay-content.directive';

import { UiInlayCloseComponent } from './inlay-close/inlay-close.component';
import { CdkPortalOutlet } from '@angular/cdk/portal';

@Component({
  selector: 'ui-inlay',
  template: `
  <ng-template #root>
    <ng-container *ngTemplateOutlet="content.tpl"></ng-container>
  </ng-template>
  <div #outletWrapper>
    <ng-template cdkPortalOutlet></ng-template>
  </div>
  `,
  exportAs: 'uiInlay',
  styleUrls: ['./inlay.component.scss']
})
export class UiInlayComponent {

  @ViewChild('root') rootTemplate: TemplateRef<any>;
  @ViewChild('outletWrapper') outletWrapper: ElementRef<any>;
  @ViewChild(CdkPortalOutlet, { static: true }) portalOutlet: CdkPortalOutlet;

  @ContentChild(UiInlayContentDirective) content: UiInlayContentDirective;
  @ContentChildren(UiInlayCloseComponent) exits: QueryList<UiInlayCloseComponent>;

  onClose() {
    return this.exits.changes.pipe(
      switchMap(options => {
        const clicks$ = options.map((option: any) => option.click$);
        return merge(...clicks$);
      })
    );
  }
}
