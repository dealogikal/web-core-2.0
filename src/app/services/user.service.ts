import { Injectable } from '@angular/core';
import * as Realm from "realm-web";
import { BehaviorSubject, combineLatest, from, Observable, of } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import * as realm from './../realm';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private stream: any;

  private auth$: BehaviorSubject<any> = new BehaviorSubject(null);
  private user$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() { }

  unsubscribe() {
    if (this.stream) this.stream.unsubscribe();
    this.user$.next(null);
  }

  private runStream(query?: any) {
    if (this.stream && query) this.stream.unsubscribe();
    const mongo = realm.app.currentUser.mongoClient("mongodb-atlas");
    const collection = mongo.db('user_profiles').collection('user_profiles');
    const stream = this.stream = realm.DB.collection(collection);

    stream.subscribe((change: any) => {
      this.user$.pipe(take(1)).subscribe(async (user) => {
        if (user && change.event) {
          if (change.event.documentKey._id.toString() !== user._id) return;
        }
        const document = await collection.findOne(query);
        document._id = document._id.toString();
        this.user$.next(document);
      });

    });
  }

  get(query?: any): Observable<any> {
    if (!query) return this.user$.asObservable();
    this.runStream(query);
    return this.user$.asObservable();
  }

  set auth(value: any) {
    this.auth$.next(value);
  }

  get auth() {
    return this.auth$.asObservable();
  }

  hasAuth(): Observable<boolean> {
    return this.auth$.pipe(
      map((user: any) => {
        if (!user) return false;
        return user.providerType == 'anon-user' ? false : true
      })
    );
  }

  login(user: { email: string, password: string }): Observable<any> {
    const credentials = Realm.Credentials.emailPassword(user.email, user.password);

    return from(realm.app.logIn(credentials).catch(error => ({ error }))).pipe(
      tap(auth => {
        this.auth$.next(auth);
      })
    );
    // return from(realm.app.logIn(credentials).then(auth => {
    //   this.auth$.next(auth);
    //   return realm.app.currentUser.functions.getUserDetailsById(auth.id)
    // }).catch(error => ({ error }))).pipe(
    //   take(1),
    //   tap((user: any) => {
    //     this.user$.next(user);
    //   }),
    // );
  }

  logout(): Observable<void> {
    return from(realm.app.currentUser.logOut()).pipe(
      take(1),
      tap(() => {
        this.user$.next(null);
        this.auth$.next(null);
      })
    );
  }

  signup(companySignup: any): Observable<any> {
    return from(realm.app.currentUser.functions.createCompanySignup(companySignup)).pipe(take(1));
  }



}
