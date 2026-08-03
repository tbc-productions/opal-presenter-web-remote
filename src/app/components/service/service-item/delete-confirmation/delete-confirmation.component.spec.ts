import { TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DeleteConfirmationComponent } from './delete-confirmation.component';

describe('DeleteConfirmationComponent', () => {
  let component: DeleteConfirmationComponent;
  let dialogRef: MatDialogRef<DeleteConfirmationComponent>;

  beforeEach(() => {
    dialogRef = { close: vi.fn() } as unknown as MatDialogRef<DeleteConfirmationComponent>;

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
      ]
    });
    component = TestBed.runInInjectionContext(() => new DeleteConfirmationComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close with false on cancel', () => {
    component.cancel();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should close with true on delete', () => {
    component.delete();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
