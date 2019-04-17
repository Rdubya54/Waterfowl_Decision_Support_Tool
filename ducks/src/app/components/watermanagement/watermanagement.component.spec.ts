import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WatermanagementComponent } from './watermanagement.component';

describe('WatermanagementComponent', () => {
  let component: WatermanagementComponent;
  let fixture: ComponentFixture<WatermanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatermanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatermanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
