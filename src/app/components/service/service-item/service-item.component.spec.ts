import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ServiceItemComponent } from './service-item.component';
import { OpenLPService } from '../../../services/openlp.service';

describe('ServiceItemComponent', () => {
  let component: ServiceItemComponent;
  let openlpService: OpenLPService;
  let dialog: MatDialog;

  beforeEach(() => {
    openlpService = {
      assertApiVersionMinimum: vi.fn().mockReturnValue(true),
    } as unknown as OpenLPService;
    dialog = { open: vi.fn() } as unknown as MatDialog;

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: OpenLPService, useValue: openlpService },
        { provide: MatDialog, useValue: dialog },
      ]
    });
    component = TestBed.runInInjectionContext(() => new ServiceItemComponent());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resolve the item icon for songs', () => {
    expect(component.getIcon({ plugin: 'songs', is_valid: true } as any)).toBe('queue_music');
  });

  it('should emit the selected item', () => {
    const item = { id: '1' } as any;
    const spy = vi.fn();
    component.selectItem.subscribe(spy);
    component.onItemSelected(item);
    expect(spy).toHaveBeenCalledWith(item);
  });
});
