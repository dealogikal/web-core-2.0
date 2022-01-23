import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import * as realm from './../../realm';

@Injectable({
    providedIn: 'root'
})
export class AccountAuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return realm.hasAuth().pipe(tap(e => {
            if (e) return;
            this.router.navigate(['']);
        }))
    }
}