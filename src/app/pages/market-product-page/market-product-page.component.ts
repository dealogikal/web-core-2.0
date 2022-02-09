import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { skip, switchMap, take } from 'rxjs/operators';
import { ProductService } from 'src/app/services/product.service';
import { StoreService } from 'src/app/services/store.service';

@UntilDestroy()
@Component({
  selector: 'market-product-page',
  templateUrl: './market-product-page.component.html',
  styleUrls: ['./market-product-page.component.scss']
})
export class MarketProductPageComponent implements OnInit {

  product$: Observable<any>;
  store$: Observable<any>;

  code_value = [
    {
      parent_id: '',
      id: 'root',
      type: 'root',
    },
    {
      parent_id: 'root',
      type: 'market',
      id: 'Petrochemicals',
      value: 'Petrochemicals'
    },
    {
      parent_id: 'root',
      type: 'market',
      id: 'Petroleum',
      value: 'Petroleum'
    },
    {
      parent_id: 'Petroleum',
      type: 'category',
      id: 'Automotive Fuel',
      value: 'Automotive Fuel'
    },
    {
      parent_id: 'Automotive Fuel',
      type: 'product',
      id: 'Automotive Diesel Oil',
      value: 'Automotive Diesel Oil'
    },
    {
      parent_id: 'Automotive Fuel',
      type: 'product',
      id: 'Unleaded Gasoline',
      value: 'Unleaded Gasoline'
    }
  ]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: StoreService,
    private product: ProductService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      untilDestroyed(this),
      switchMap(params => this.product.get({ url: params.product_url }).pipe(skip(1), take(1))),
      switchMap(product => this.store.get({ url: product.storefront.url }).pipe(skip(1), take(1)))
    ).subscribe();

    this.product$ = this.product.get();

    this.store$ = this.store.get();
    this.test();
  }

  ngOnDestroy(): void {
  }

  test() {

    //Keeps track of nodes using id as key, for fast lookup
    var idToNodeMap: any = {};

    //Initially set our loop to null
    var root: any = [];

    // var orphanHolder: any = []

    //loop over data
    this.code_value.forEach((datum: any) => {

      //each node will have children, so let's give it a "children" poperty
      datum.children = [];

      //add an entry for this node to the map so that any future children can
      //lookup the parent
      idToNodeMap[datum.id] = datum;

      //Does this node have a parent?
      if (!datum.parent_id) {
        //Doesn't look like it, so this node is the root of the tree
        root = datum;
      } else {
        //This node has a parent, so let's look it up using the id
        let parentNode = idToNodeMap[datum.parent_id];
        //Let's add the current node as a child of the parent node.
        parentNode.children.push(datum);
      }

    });


    console.log('markets', root)

  }

}
