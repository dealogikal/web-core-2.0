import { Injectable } from '@angular/core';
import * as Realm from "realm-web";
import { BehaviorSubject, combineLatest, from, Observable, of } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import * as realm from './../realm';


@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private store$: BehaviorSubject<any> = new BehaviorSubject(null);
  storeStream: any;

  constructor() { }

  unsubscribeStream() {
    if (this.storeStream) this.storeStream.unsubscribe();
    this.store$.next(null);
  }

  private runStoreStream(query?: any, projection?: any) {
    if (this.storeStream && query) this.storeStream.unsubscribe();

    const mongo = realm.app.currentUser.mongoClient("mongodb-atlas");
    const collection = mongo.db('user_profiles').collection('storefronts');
    const stream = this.storeStream = realm.DB.collection(collection);

    stream.subscribe((change: any) => {

      this.store$.pipe(take(1)).subscribe(async (store) => {
        if (store && change.event) {
          if (change.event.documentKey._id.toString() !== store._id) return;
        }
        const document = await collection.findOne(query, projection);
        this.store$.next(document);
      });

    });
  }

  get(query?: any): Observable<any> {
    if (!query) return this.store$.asObservable();
    this.runStoreStream(query);
    return this.store$.asObservable();
  }

  create(store: any): Observable<any> {
    return from(realm.app.currentUser.functions.createStorefront(store)).pipe(take(1));
  }

  update(store: any): Observable<any> {
    return from(realm.app.currentUser.functions.updateStorefront(store)).pipe(take(1));
  }

  deactivate(store_url: any) {

  }




}

