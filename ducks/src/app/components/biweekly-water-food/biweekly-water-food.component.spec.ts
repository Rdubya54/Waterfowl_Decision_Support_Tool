import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiweeklyWaterFoodComponent } from './biweekly-water-food.component';

describe('BiweeklyWaterFoodComponent', () => {
  let component: BiweeklyWaterFoodComponent;
  let fixture: ComponentFixture<BiweeklyWaterFoodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiweeklyWaterFoodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiweeklyWaterFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
