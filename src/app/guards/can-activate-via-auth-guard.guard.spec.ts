import { TestBed, async, inject } from '@angular/core/testing';

import { CanActivateViaAuthGuardGuard } from './can-activate-via-auth-guard.guard';

describe('CanActivateViaAuthGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateViaAuthGuardGuard]
    });
  });

  it('should ...', inject([CanActivateViaAuthGuardGuard], (guard: CanActivateViaAuthGuardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
