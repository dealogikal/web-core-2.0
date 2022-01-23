import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, from, Observable, of } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import * as realm from '../realm';


@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private stream: any;
    private listStream: any;

    private product$: BehaviorSubject<any> = new BehaviorSubject(null);
    private list$: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor() { }

    unsubscribeList() {
        if (this.listStream) this.listStream.unsubscribe();
        this.list$.next(null);
    }

    unsubscribe() {
        if (this.stream) this.stream.unsubscribe();
        this.product$.next(null);
        this.listStream = null;
    }

    private runList(query?: any, { projection = {} }: any = {}, filterFn?: any) {
        if (this.listStream && query) this.listStream.unsubscribe();
        const mongo = realm.app.currentUser.mongoClient("mongodb-atlas");
        const collection = mongo.db('products').collection('brand_specific');
        const listStream = this.listStream = realm.DB.collection(collection);

        listStream.subscribe(async (change: any) => {
            if (filterFn) {
                const _filterFn = filterFn(change);
                if (!_filterFn) return;
            }
            console.log('query >>>', query);
            console.log('proj >>>', projection);
            const documents = await collection.find(query, { projection });

            this.list$.next(documents);
        });
    }

    private runStream(query?: any, { projection = {} }: any = {}, filterFn?: any) {
        if (this.stream && query) this.stream.unsubscribe();
        const mongo = realm.app.currentUser.mongoClient("mongodb-atlas");
        const collection = mongo.db('products').collection('brand_specific');
        const stream = this.stream = realm.DB.collection(collection);

        stream.subscribe(async (change: any) => {
            if (filterFn) {
                const _filterFn = filterFn(change);
                if (!_filterFn) return;
            }
            const document = await collection.findOne(query, { projection });

            this.product$.next(document);
        });
    }

    list(query?: any, { projection = {} }: any = {}, filterFn?: any): Observable<any> {
        console.log('query', query)
        if (!query) return this.list$.asObservable();
        this.runList(query, { projection }, filterFn);
        return this.list$.asObservable();
    }

    get(query?: any, { projection = {} }: any = {}, filterFn?: any): Observable<any> {
        if (!query) return this.product$.asObservable();
        this.runStream(query, { projection }, filterFn);
        return this.product$.asObservable();
    }

    create(product: any): Observable<any> {
        return from(realm.app.currentUser.functions.createProduct(product)).pipe(take(1));
    }

    update(product: any): Observable<any> {
        return from(realm.app.currentUser.functions.updateProduct(product)).pipe(take(1));
    }


}
