import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { skip } from 'rxjs/operators';

@Injectable()
export class UiInlay {

  private close$:BehaviorSubject<boolean> = new BehaviorSubject(undefined);

  onClose() {
    return this.close$.asObservable().pipe(skip(1));
  }

  constructor() { }

  close() {
    this.close$.next(true)
  }

}
