import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[uiAutocompleteContent]'
})
export class UiAutocompleteContentDirective {

  constructor(public tpl: TemplateRef<any>) {
  }

}
