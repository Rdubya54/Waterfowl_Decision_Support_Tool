import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WatermanagementComponent } from 'src/app/components/watermanagement/watermanagement.component';
import { Weather } from './model/weather';
import { WeatherComponent } from './components/weather/weather.component';
import {BiweeklyWaterFoodComponent} from './components/biweekly-water-food/biweekly-water-food.component'
import { FoodAvailComponent } from './components/food-avail/food-avail.component';
import {GaugeStatsComponent} from "./components/gauge-stats/gauge-stats.component";


const routes: Routes = [
  { path: 'watermanagement', component: WatermanagementComponent },
  {path:'weather',component:WeatherComponent},
  {path:'waterfood',component:BiweeklyWaterFoodComponent},
  {path:'fallfood',component:FoodAvailComponent},
  {path:'gaugestats',component:GaugeStatsComponent}
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
