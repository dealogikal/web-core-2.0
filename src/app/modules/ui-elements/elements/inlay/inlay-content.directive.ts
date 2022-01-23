import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[uiInlayContent]'
})
export class UiInlayContentDirective {

  constructor(public tpl: TemplateRef<any>) {
  }

}
