import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, skip, take, tap } from 'rxjs/operators';
import { UiInlay } from 'src/app/modules/ui-elements/elements/inlay/inlay.service';
import { MarketService } from 'src/app/services/markets.service';

@UntilDestroy()
@Component({
  selector: 'category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss']
})
export class CategorySelectorComponent implements OnInit {

  @Output() onSave = new EventEmitter();

  @Input() set value(val: any) {
    this.value$.next(val);
  }

  markets$: Observable<any>;
  value$: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  nodes$: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  categories$: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  initialLoad$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  save$: Observable<any>;

  constructor(
    private market: MarketService,
    private inlay: UiInlay
  ) { }

  ngOnInit(): void {


    this.markets$ = this.market.tree().pipe(
      map(response => response.data),
      tap(root => {
        this.nodes$.next([root]);
        this.initialLoad$.next(false)
      })
    );

    this.save$ = this.categories$.pipe(
      skip(1),
      map(categories => {
        console.log(categories);
        if (!categories.length) return false;
        return !categories[categories.length - 1].children.length;
      })
    );

    combineLatest([
      this.nodes$.pipe(skip(1),take(1)),
      this.value$.pipe(filter(value => !!value))
    ]).pipe(
      untilDestroyed(this),
      tap(([nodes, value]) => {
        nodes = JSON.parse(JSON.stringify(nodes));
        let nodes_from_value = value.reduce((nodes, category, index) => {
          const node = nodes[index].children.find((child: any) => {
            console.log(category, child);
            return child._id == category._id;
          });
          nodes.push(node);
          return nodes;
        }, nodes);
        this.nodes$.next(nodes_from_value);
        const categories = nodes_from_value.filter((node: any, index: number) => index !== 0);
        this.categories$.next(categories);
      })
    ).subscribe();

    // this.categories$.subscribe(e => console.log(e));
  }

  onSelectItem(item: any, nodeIdx: number) {
    if (nodeIdx + 1 <= this.categories$.value.length) {
      this.categories$.next([...this.categories$.value.slice(0, nodeIdx)]);
    }
    this.categories$.next([...this.categories$.value, item]);


    if (!item.children.length) return;
    if (nodeIdx + 1 < this.nodes$.value.length) {
      this.nodes$.next([...this.nodes$.value.slice(0, nodeIdx + 1)]);
    }
    this.nodes$.next([...this.nodes$.value, item]);
  }

  onSaveHandler() {
    this.categories$.pipe(take(1)).subscribe(categories => {
      console.log('wewew');
      this.onSave.emit(categories.map(category => {
        const { children, created_at, ...a } = category;
        return a;
      }));

      this.inlay.close();
    })
  }

  ngOnDestroy() {}

}
