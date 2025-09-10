import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerCartComponent } from './organizer-cart.component';

describe('OrganizerCartComponent', () => {
  let component: OrganizerCartComponent;
  let fixture: ComponentFixture<OrganizerCartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizerCartComponent]
    });
    fixture = TestBed.createComponent(OrganizerCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
