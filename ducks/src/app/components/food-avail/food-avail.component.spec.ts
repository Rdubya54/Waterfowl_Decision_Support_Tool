import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodAvailComponent } from './food-avail.component';

describe('FoodAvailComponent', () => {
  let component: FoodAvailComponent;
  let fixture: ComponentFixture<FoodAvailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodAvailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodAvailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
