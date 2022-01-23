import { Injectable } from '@angular/core';
import { combineLatest, fromEvent, Observable, Subscription } from 'rxjs';
import { combineAll, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme$?: Observable<any>;
  $theme?: Subscription;
  $initial?: Subscription;


  constructor() {
    this.$initial = combineLatest([
      fromEvent(document, 'DOMContentLoaded').pipe(take(1))
    ]).subscribe(() => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.add(isDark ? "dark-app-theme" : "light-app-theme");
    })

    this.$theme = fromEvent(window.matchMedia('(prefers-color-scheme: dark)'), 'change').subscribe((e: any) => {
      const oldTheme = document.body.classList.contains("light-app-theme") ? "light-app-theme" : "dark-app-theme";
      document.body.classList.remove(oldTheme);
      const newTheme = oldTheme === "light-app-theme" ? "dark-app-theme" : "light-app-theme";
      document.body.classList.add(newTheme);
    });

  }
}
