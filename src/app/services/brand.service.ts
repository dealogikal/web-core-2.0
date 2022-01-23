import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, from, Observable, of } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import * as realm from './../realm';


@Injectable({
    providedIn: 'root'
})
export class BrandService {

    private stream: any;
    private listStream: any;

    private brand$: BehaviorSubject<any> = new BehaviorSubject(null);
    private list$: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor() { }

    unsubscribeList() {
        if (this.listStream) this.listStream.unsubscribe();
        this.list$.next(null);
    }

    unsubscribe() {
        if (this.stream) this.stream.unsubscribe();
        this.brand$.next(null);
    }

    private runList(query: any, filterFn?: any) {
        if (this.listStream && query) this.listStream.unsubscribe();

        const mongo = realm.app.currentUser.mongoClient("mongodb-atlas");
        const collection = mongo.db('products').collection('brands');
        const listStream = this.listStream = realm.DB.collection(collection);

        listStream.subscribe(async (change: any) => {
            if (filterFn) {
                const _filterFn = filterFn(change);
                if (!_filterFn) return;
            }

            const documents = await collection.find(query);

            this.list$.next(documents);
        });
    }

    private runStream(query: any, filterFn?: any) {
        if (this.stream && query) this.stream.unsubscribe();

        console.log('query ??? >>>', query);
        const mongo = realm.app.currentUser.mongoClient("mongodb-atlas");
        const collection = mongo.db('products').collection('brands');
        const stream = this.stream = realm.DB.collection(collection);

        stream.subscribe(async (change: any) => {
            if (filterFn) {
                const _filterFn = filterFn(change);
                if (!_filterFn) return;
            }
            console.log('finding ??? >>>');
            const document = await collection.findOne(query);

            this.brand$.next(document);
        });
    }

    list(query?: any, filterFn?: any): Observable<any> {
        if (!query) return this.list$.asObservable();
        this.runList(query, filterFn);
        return this.list$.asObservable();
    }

    get(query?: any, filterFn?: any): Observable<any> {
        if (!query) return this.brand$.asObservable();
        this.runStream(query, filterFn);
        return this.brand$.asObservable();
    }

    create(brand: any): Observable<any> {
        return from(realm.app.currentUser.functions.createBrand(brand)).pipe(take(1));
    }

    update(brand: any): Observable<any> {
        return from(realm.app.currentUser.functions.updateBrand(brand)).pipe(take(1));
    }


}
