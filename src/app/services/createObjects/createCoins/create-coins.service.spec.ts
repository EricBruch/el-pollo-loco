import { TestBed } from '@angular/core/testing';

import { CreateCoinsService } from './create-coins.service';

describe('CreateCoinsService', () => {
  let service: CreateCoinsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateCoinsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
