import { TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TitleCasePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginComponent } from './login.component';
import { OpenLPService } from '../../services/openlp.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let dialogRef: MatDialogRef<LoginComponent>;
  let openlpService: OpenLPService;
  const snackBar: MatSnackBar = { open: vi.fn() } as unknown as MatSnackBar;
  const translateService: TranslateService = { stream: vi.fn() } as unknown as TranslateService;

  beforeEach(() => {
    dialogRef = { close: vi.fn() } as unknown as MatDialogRef<LoginComponent>;
    const isLoggedInChanged$ = { emit: vi.fn(), subscribe: vi.fn() };

    openlpService = {
      login: vi.fn().mockReturnValue(of({ token: 'abc' } as any)),
      isLoggedInChanged$: isLoggedInChanged$,
    } as unknown as OpenLPService;
    vi.mocked(translateService.stream).mockReturnValue(of('LOGIN_SUCCEEDED'));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: OpenLPService, useValue: openlpService },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: TitleCasePipe, useValue: { transform: (value: string) => value } },
        { provide: TranslateService, useValue: translateService },
      ]
    });
    component = TestBed.runInInjectionContext(() => new LoginComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog when canceled', () => {
    component.cancel();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should log in and close the dialog', () => {
    component.username = 'demo';
    component.password = 'secret';

    component.login();

    expect(openlpService.login).toHaveBeenCalledWith({ username: 'demo', password: 'secret' });
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
