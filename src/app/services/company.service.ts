import { Injectable } from '@angular/core';
import * as Realm from "realm-web";
import { BehaviorSubject, combineLatest, from, Observable, of } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import * as realm from './../realm';


@Injectable({
    providedIn: 'root'
})
export class CompanyService {

    private company$: BehaviorSubject<any> = new BehaviorSubject(null);
    private stream: any;

    constructor() { }

    unsubscribe() {
        if (this.stream) this.stream.unsubscribe();
        this.company$.next(null);
    }

    private runStream(query: any) {
        if (this.stream && query) this.stream.unsubscribe();

        const mongo = realm.app.currentUser.mongoClient("mongodb-atlas");
        const collection = mongo.db('user_profiles').collection('companies');
        const stream = this.stream = realm.DB.collection(collection);

        stream.subscribe((change: any) => {

            this.company$.pipe(take(1)).subscribe(async (company) => {
                if (company && change.event) {
                    if (change.event.documentKey._id.toString() !== company._id) return;
                }
                const document = await collection.findOne(query);
                document._id = document._id.toString();
                this.company$.next(document);
            });

        });
    }

    get(query?: any): Observable<any> {
        if (!query) return this.company$.asObservable();
        this.runStream(query);
        return this.company$.asObservable();
    }

    update(company: any): Observable<any> {
        return from(realm.app.currentUser.functions.updateCompany(company)).pipe(take(1));
    }

}
