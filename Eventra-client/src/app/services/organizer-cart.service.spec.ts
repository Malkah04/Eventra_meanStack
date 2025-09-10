import { TestBed } from '@angular/core/testing';

import { OrganizerCartService } from './organizer-cart.service';

describe('OrganizerCartService', () => {
  let service: OrganizerCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizerCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
