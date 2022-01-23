import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'dealo-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss']
})
export class MarketsComponent implements OnInit {

  @HostBinding('style.background') bg = '';

  data$: BehaviorSubject<Array<any>> = new BehaviorSubject([
    {
      label: 'Petroleum',
      icon: 'assets/icons/fuel-pump.png',
      background: 'linear-gradient(225deg, #CDDDF4 3.26%, #CDBAFA 100%)'
    },
    {
      label: 'Petrochemicals',
      icon: 'assets/icons/beaker.png',
      background: 'linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)'
    },
    {
      label: 'Medical Supplies',
      icon: 'assets/icons/medical-mask.png',
      background: 'linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)'
    },
    {
      label: 'Cement',
      icon: 'assets/icons/cement.png',
      background: 'linear-gradient(225deg, #CDDDF4 3.26%, #CDBAFA 100%)'
    },
    {
      label: 'Semiconductor & <br> Electronics',
      icon: 'assets/icons/circuit.png',
      background: 'linear-gradient(225deg, #CDDDF4 3.26%, #CDBAFA 100%)'
    },
    {
      label: 'Agriculture',
      icon: 'assets/icons/wheat.png',
      background: 'linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)'
    }
  ])


  constructor() { }

  ngOnInit(): void {
  }

  onMouseOver(url: string) {
    this.bg = `${url}`;
  }

  onMouseOut() {
    // this.bg = ``;
  }
}
