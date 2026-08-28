import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrandThemeService } from './brand-theme.service';

/** Flush the service's `effect()` so DOM / storage side effects run. */
function flush(): void {
  TestBed.inject(ApplicationRef).tick();
}

describe('BrandThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-brand');
    document.documentElement.removeAttribute('data-theme');
    TestBed.configureTestingModule({});
  });

  it('defaults to the konica brand and light scheme', () => {
    const service = TestBed.inject(BrandThemeService);
    expect(service.brand()).toBe('konica');
    expect(service.isDark()).toBe(false);
  });

  it('reflects the brand onto <html> and persists it', () => {
    const service = TestBed.inject(BrandThemeService);
    service.setBrand('aurora');
    flush();
    expect(document.documentElement.dataset['brand']).toBe('aurora');
    expect(localStorage.getItem('ds.brand')).toBe('aurora');
  });

  it('toggles the colour scheme', () => {
    const service = TestBed.inject(BrandThemeService);
    service.toggleColorScheme();
    expect(service.isDark()).toBe(true);
    flush();
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('restores a persisted brand on construction', () => {
    localStorage.setItem('ds.brand', 'aurora');
    const service = TestBed.inject(BrandThemeService);
    expect(service.brand()).toBe('aurora');
  });
});
