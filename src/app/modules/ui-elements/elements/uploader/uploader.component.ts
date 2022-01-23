import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';

import * as cloudinary from '../../../../cloudinary';

@Component({
  selector: 'ui-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
  host: { 'class': 'form-uploader' }
})
export class UiUploaderComponent implements OnInit {

  @Input() multiple: boolean = false;
  @Input() accept: string = '';
  @Input() folder: string = '';
  @Input() tags: string = '';
  @Input() icon: string = '';
  @Input() label: string = '';

  @Output() onUploadComplete = new EventEmitter();


  uploader: FileUploader;

  constructor(
    private host: ElementRef
  ) { }

  ngOnInit(): void {
    this.uploader = new FileUploader(cloudinary.uploader_options);

    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {

      let public_id = `${moment().unix()}_${fileItem.file.name}`;
      form.append('upload_preset', cloudinary.config.upload_preset);
      form.append("public_id", public_id);
      form.append('folder', this.folder);
      form.append('tags', this.tags);
      form.append('file', fileItem);

      fileItem.withCredentials = false;

      return { fileItem, form };
    };

    this.uploader.response.subscribe(response => {
      response = JSON.parse(response);
      this.onUploadComplete.emit(response);
    });


  }

}
