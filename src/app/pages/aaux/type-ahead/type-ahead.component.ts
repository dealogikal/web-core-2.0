import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'type-ahead',
  templateUrl: './type-ahead.component.html',
  styleUrls: ['./type-ahead.component.scss']
})
export class TypeAheadComponent implements OnInit {
  
  @Output() onStart = new EventEmitter();

  products = [
    { id: 1, label: 'Product One' },
    { id: 2, label: 'Product Two' },
    { id: 3, label: 'Product Three' }
  ];


  locations = [
    { id: 1, label: 'Location One' },
    { id: 2, label: 'Location Two' },
    { id: 3, label: 'Location Three' }
  ];

  control = new FormControl();

  constructor() { }

  ngOnInit(): void {
  }

  onStartHandler() {
    console.log('onStartHandler emitter')
    this.onStart.emit(true);
  }

}
