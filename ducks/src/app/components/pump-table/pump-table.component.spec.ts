import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PumpTableComponent } from './pump-table.component';

describe('PumpTableComponent', () => {
  let component: PumpTableComponent;
  let fixture: ComponentFixture<PumpTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PumpTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PumpTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
