import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'ui-grid-gallery',
  templateUrl: './grid-gallery.component.html',
  styleUrls: ['./grid-gallery.component.scss']
})
export class UiGridGalleryComponent implements OnInit {

  images$: BehaviorSubject<any> = new BehaviorSubject([]);

  @Input() accept: string = '';
  @Input() folder: string = '';
  @Input() tags: string = '';
  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() max: number = 5;

  @Input()
  set images(value: any) {
    this.images$.next(value);
  }

  @Output() onUploadComplete = new EventEmitter();
  @Output() onDeleteItem = new EventEmitter();

  // https://res.cloudinary.com/demo/image/upload/t_jpg_with_quality_30/t_crop_400x400/t_fit_100x150/sample.jpg
  thumbLg: string = `https://res.cloudinary.com/demo/image/fetch/w_600,h_540,t_jpg_with_quality_30/`;
  thumbSm: string = `https://res.cloudinary.com/demo/image/fetch/w_300,h_270,q_95/f_jpg/`;

  constructor() { }

  ngOnInit(): void {
  }

  onUpload(response: any): void {
    this.onUploadComplete.emit(response);
  }

  onDelete(index: number) {
    this.onDeleteItem.emit(index);
  }

}
