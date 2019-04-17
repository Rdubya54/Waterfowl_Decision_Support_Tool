import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  logged_in:boolean=false;
  role: string = 'test';
  lat:string='test_lat';
  long:string='test_long';
}