import { TestBed } from '@angular/core/testing';

import { GraphFilterService } from './graph-filter.service';

describe('GraphFilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GraphFilterService = TestBed.get(GraphFilterService);
    expect(service).toBeTruthy();
  });
});
