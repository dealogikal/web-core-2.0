import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'ui-photo-uploader',
  templateUrl: './photo-uploader.component.html',
  styleUrls: ['./photo-uploader.component.scss']
})
export class UiPhotoUploaderComponent implements OnInit {

  image$: BehaviorSubject<any> = new BehaviorSubject(null);

  @Input() accept: string = '';
  @Input() folder: string = '';
  @Input() tags: string = '';
  @Input() icon: string = '';
  @Input() label: string = '';

  @Input()
  set image(value: any) {
    this.image$.next(value);
  }

  @Output() onUploadComplete = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onUpload(response: any): void {
    this.onUploadComplete.emit(response);
  }


}
