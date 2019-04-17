import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs';

@Injectable()
export class ChartService {
	private sidenav: MatSidenav;

	public setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
    console.log("4 it is"+this.sidenav)
	}

	public open() {
		return this.sidenav.open();
	}


	public close() {
		return this.sidenav.close();
	}

	public toggle(): void {
    console.log("3 it is"+this.sidenav)
		this.sidenav.toggle();
	}
}