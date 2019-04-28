import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WatermanagementComponent } from 'src/app/components/watermanagement/watermanagement.component';
import { DataReviewComponent } from './components/data-review/data-review.component';
import { Weather } from './model/weather';
import { WeatherComponent } from './components/weather/weather.component';
import {BiweeklyWaterFoodComponent} from './components/biweekly-water-food/biweekly-water-food.component'
import { FoodAvailComponent } from './components/food-avail/food-avail.component';
import {PumpManagementComponent} from './components/pump-management/pump-management.component'
import { PumpTableComponent } from './components/pump-table/pump-table.component';
import {GaugeStatsComponent} from "./components/gauge-stats/gauge-stats.component";


const routes: Routes = [
  { path: 'watermanagement', component: WatermanagementComponent },
  { path: 'datareview', component: DataReviewComponent },
  {path:'weather',component:WeatherComponent},
  {path:'waterfood',component:BiweeklyWaterFoodComponent},
  {path:'fallfood',component:FoodAvailComponent},
  {path:'pumpmanagement',component:PumpManagementComponent},
  {path:'pumptable',component:PumpTableComponent},
  {path:'gaugestats',component:GaugeStatsComponent}
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
