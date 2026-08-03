import { TitleCasePipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AlertComponent } from './alert.component';
import { OpenLPService } from '../../services/openlp.service';
import { PageTitleService } from '../../services/page-title.service';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let openlpService: OpenLPService;
  let snackBar: MatSnackBar;
  let pageTitleService: PageTitleService ;
  let translateService: TranslateService;

  beforeEach(() => {
    openlpService = { showAlert: vi.fn().mockReturnValue(of({}) as never) } as unknown as OpenLPService;
    snackBar = { open: vi.fn() } as unknown as MatSnackBar;
    pageTitleService = { changePageTitle: vi.fn() } as unknown as PageTitleService;
    translateService = { stream: vi.fn().mockReturnValue(of('ALERTS') as never) } as unknown as TranslateService;

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: PageTitleService, useValue: pageTitleService },
        { provide: OpenLPService, useValue: openlpService },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: TitleCasePipe, useValue: { transform: (value: string) => value } },
        { provide: TranslateService, useValue: translateService },
      ]
    });
    component = TestBed.runInInjectionContext(() => new AlertComponent());

    component['pageTitleService'] = pageTitleService;
    component['openlpService'] = openlpService;
    component['snackBar'] = snackBar;
    component['titleCasePipe'] = new TitleCasePipe();
    component['translateService'] = translateService;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the page title on init', () => {
    component.ngOnInit();
    expect(pageTitleService.changePageTitle).toHaveBeenCalledWith('ALERTS');
  });

  it('should submit an alert and open the snackbar', () => {
    component.alert = 'Test alert';
    component.alertMessage = 'Alert submitted';

    component.onSubmit();

    expect(openlpService.showAlert).toHaveBeenCalledWith('Test alert');
    expect(snackBar.open).toHaveBeenCalledWith('Alert submitted', '', { duration: 2000 });
  });
});

