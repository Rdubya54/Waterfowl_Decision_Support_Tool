import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeStatsComponent } from './gauge-stats.component';

describe('GaugeStatsComponent', () => {
  let component: GaugeStatsComponent;
  let fixture: ComponentFixture<GaugeStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GaugeStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GaugeStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
