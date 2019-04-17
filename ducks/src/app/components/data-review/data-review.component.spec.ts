import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataReviewComponent } from './data-review.component';

describe('DataReviewComponent', () => {
  let component: DataReviewComponent;
  let fixture: ComponentFixture<DataReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
