import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, from, Observable, of } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import * as realm from '../realm';


@Injectable({
    providedIn: 'root'
})
export class MarketService {

    private stream: any;
    private stream$: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor() { }

    unsubscribe() {
        if (this.stream) this.stream.unsubscribe();
        this.stream$.next(null);
    }

    private runStream(query?: any, { projection = {} }: any = {}, filterFn?: any) {
        if (this.stream && query) this.stream.unsubscribe();

        const mongo = realm.app.currentUser.mongoClient("mongodb-atlas");
        const collection = mongo.db('configurations').collection('markets');
        const stream = this.stream = realm.DB.collection(collection);

        stream.subscribe(async (change: any) => {
            if (filterFn) {
                const _filterFn = filterFn(change);
                if (!_filterFn) return;
            }
            const document = await collection.findOne(query, { projection });
            this.stream$.next(document);
        });
    }

    get(query?: any, { projection = {} }: any = {}, filterFn?: any) {
        if (!query) return this.stream$.asObservable();
        this.runStream(query, { projection }, filterFn);
        return this.stream$.asObservable();
    }

    tree() {
        return from(realm.app.currentUser.functions.getMarketTree()).pipe(take(1));
    }

    create(entry: any): Observable<any> {
        return from(realm.app.currentUser.functions.createMarketEntry(entry)).pipe(take(1));
    }

    update(brand: any): Observable<any> {
        return from(realm.app.currentUser.functions.updateMarketEntry(brand)).pipe(take(1));
    }


}
