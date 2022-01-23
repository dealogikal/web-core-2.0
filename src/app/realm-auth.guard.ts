import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import * as realm from './realm';
import { UserService } from './services/user.service';

@Injectable({
    providedIn: 'root'
})
export class RealmAuthGuard implements CanActivate {

    constructor(private user: UserService) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return realm.auth().then(auth => {
            this.user.auth = auth;
            return auth ? true : false;
        });
    }
}