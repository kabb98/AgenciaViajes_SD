import { TestBed } from '@angular/core/testing';

import { ApiGWService } from './api-gw.service';

describe('ApiGWService', () => {
  let service: ApiGWService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiGWService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
