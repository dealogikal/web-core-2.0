import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ui-loader-ell',
  templateUrl: './loader-ell.component.html',
  styleUrls: ['./loader-ell.component.scss']
})
export class UiLoaderEllComponent implements OnInit {

  @Input() color: string = '--text-color-primary-with-bgcolor';

  constructor() { }

  ngOnInit(): void {
  }

}
