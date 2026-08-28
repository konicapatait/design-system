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

  it('defaults to brand-1 and light scheme', () => {
    const service = TestBed.inject(BrandThemeService);
    expect(service.brand()).toBe('brand-1');
    expect(service.isDark()).toBe(false);
  });

  it('reflects the brand onto <html> and persists it', () => {
    const service = TestBed.inject(BrandThemeService);
    service.setBrand('brand-2');
    flush();
    expect(document.documentElement.dataset['brand']).toBe('brand-2');
    expect(localStorage.getItem('ds.brand')).toBe('brand-2');
  });

  it('toggles the colour scheme', () => {
    const service = TestBed.inject(BrandThemeService);
    service.toggleColorScheme();
    expect(service.isDark()).toBe(true);
    flush();
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('restores a persisted brand on construction', () => {
    localStorage.setItem('ds.brand', 'brand-2');
    const service = TestBed.inject(BrandThemeService);
    expect(service.brand()).toBe('brand-2');
  });
});
