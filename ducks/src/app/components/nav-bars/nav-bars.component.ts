import { Component, OnInit } from '@angular/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';

import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, OnDestroy} from '@angular/core';

@Component({
  selector: 'app-nav-bars',
  templateUrl: './nav-bars.component.html',
  styleUrls: ['./nav-bars.component.css']
})
export class NavBarsComponent implements OnInit {

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }  

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  
  ngOnInit() {
  }

  reload_app(){
    location.reload()
  }

}
