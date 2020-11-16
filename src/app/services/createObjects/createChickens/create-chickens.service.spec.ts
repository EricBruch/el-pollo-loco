import { TestBed } from '@angular/core/testing';

import { CreateChickensService } from './create-chickens.service';

describe('CreateChickensService', () => {
  let service: CreateChickensService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateChickensService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
