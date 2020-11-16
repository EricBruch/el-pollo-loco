import { TestBed } from '@angular/core/testing';

import { GenerateBottlesService } from './generate-bottles.service';

describe('GenerateBottlesService', () => {
  let service: GenerateBottlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateBottlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
