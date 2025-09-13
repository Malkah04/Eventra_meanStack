import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsListComponent } from './event-list.component';

describe('EventListComponent', () => {
  let component: EventsListComponent;
  let fixture: ComponentFixture<EventsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventsListComponent]
    });
    fixture = TestBed.createComponent(EventsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
