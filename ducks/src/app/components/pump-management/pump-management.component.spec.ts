import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PumpManagementComponent } from './pump-management.component';

describe('PumpManagementComponent', () => {
  let component: PumpManagementComponent;
  let fixture: ComponentFixture<PumpManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PumpManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PumpManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
