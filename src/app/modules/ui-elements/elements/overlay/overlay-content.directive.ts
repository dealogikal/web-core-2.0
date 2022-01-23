import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[uiOverlayContent]'
})
export class UiOverlayContentDirective {

  constructor(public tpl: TemplateRef<any>) {
  }
}
