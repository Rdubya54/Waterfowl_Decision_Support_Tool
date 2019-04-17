import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarsComponent } from './nav-bars.component';

describe('NavBarsComponent', () => {
  let component: NavBarsComponent;
  let fixture: ComponentFixture<NavBarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavBarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
