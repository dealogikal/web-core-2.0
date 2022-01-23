import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuModule } from 'ngx-contextmenu';
import { UiAutocompleteComponent } from './elements/autocomplete/autocomplete.component';
import { UiAutocompleteDirective } from './elements/autocomplete/autocomplete.directive';
import { UiAutocompleteOptionComponent } from './elements/autocomplete/autocomplete-option/autocomplete-option.component';
import { UiAutocompleteContentDirective } from './elements/autocomplete/autocomplete-content.directive';
import { PortalModule } from '@angular/cdk/portal';
import { UiOverlayComponent } from './elements/overlay/overlay.component';
import { UiOverlayDirective } from './elements/overlay/overlay.directive';
import { UiOverlayContentDirective } from './elements/overlay/overlay-content.directive';
import { UiOverlay } from './elements/overlay/overlay.service';
import { UiInlayComponent } from './elements/inlay/inlay.component';
import { UiInlayDirective } from './elements/inlay/inlay.directive';
import { UiInlayContentDirective } from './elements/inlay/inlay-content.directive';
import { UiInlayCloseComponent } from './elements/inlay/inlay-close/inlay-close.component';
import { UiInlay } from './elements/inlay/inlay.service';
import { UiUploaderComponent } from './elements/uploader/uploader.component';
import { FileUploadModule } from 'ng2-file-upload';
import { InlineSVGModule } from 'ng-inline-svg';
import { UiGridGalleryComponent } from './elements/grid-gallery/grid-gallery.component';
import { UiPhotoUploaderComponent } from './elements/photo-uploader/photo-uploader.component';
import { UiLoaderEllComponent } from './elements/loader-ell/loader-ell.component';

@NgModule({
  declarations: [
    UiAutocompleteComponent,
    UiAutocompleteDirective,
    UiAutocompleteOptionComponent,
    UiAutocompleteContentDirective,
    UiOverlayComponent,
    UiOverlayDirective,
    UiOverlayContentDirective,
    UiInlayComponent,
    UiInlayDirective,
    UiInlayContentDirective,
    UiInlayCloseComponent,
    UiUploaderComponent,
    UiGridGalleryComponent,
    UiPhotoUploaderComponent,
    UiLoaderEllComponent,
  ],
  imports: [
    CommonModule,
    PortalModule,
    FileUploadModule,
    ContextMenuModule.forRoot(),
    InlineSVGModule.forRoot(),
  ],
  providers: [
    UiOverlay,
    UiInlay
  ],
  exports: [
    UiAutocompleteComponent,
    UiAutocompleteDirective,
    UiAutocompleteOptionComponent,
    UiAutocompleteContentDirective,
    UiOverlayComponent,
    UiOverlayDirective,
    UiOverlayContentDirective,
    UiInlayComponent,
    UiInlayDirective,
    UiInlayContentDirective,
    UiInlayCloseComponent,
    UiUploaderComponent,
    UiGridGalleryComponent,
    UiPhotoUploaderComponent,
    UiLoaderEllComponent,
  ]
})
export class UiElementsModule { }
