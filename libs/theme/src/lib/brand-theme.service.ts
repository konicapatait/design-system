import {
  computed,
  effect,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  BRANDS as KNOWN_BRANDS,
  COLOR_SCHEMES as KNOWN_SCHEMES,
  type Brand,
  type ColorScheme,
} from './brand.types';
import { BRAND_THEME_DEFAULTS } from './brand-theme.config';

const BRAND_STORAGE_KEY = 'ds.brand';
const SCHEME_STORAGE_KEY = 'ds.color-scheme';

/**
 * Single source of truth for the active brand and colour scheme.
 *
 * It mirrors its state onto `<html data-brand data-theme>` and `color-scheme`,
 * which is all the generated `@brand/tokens/css` needs to repaint the entire
 * application — ng-zorro chrome included — with no rebuild.
 */
@Injectable({ providedIn: 'root' })
export class BrandThemeService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly defaults = inject(BRAND_THEME_DEFAULTS, { optional: true }) ?? {};

  readonly brand = signal<Brand>(this.readBrand());
  readonly colorScheme = signal<ColorScheme>(this.readColorScheme());
  readonly isDark = computed(() => this.colorScheme() === 'dark');

  readonly availableBrands = KNOWN_BRANDS;

  constructor() {
    // Reflect state to the DOM + persist it whenever either signal changes.
    effect(() => {
      const brand = this.brand();
      const scheme = this.colorScheme();
      if (!this.isBrowser) {
        return;
      }
      const root = document.documentElement;
      root.dataset['brand'] = brand;
      root.dataset['theme'] = scheme;
      root.style.colorScheme = scheme;
      this.persist(BRAND_STORAGE_KEY, brand);
      this.persist(SCHEME_STORAGE_KEY, scheme);
    });
  }

  setBrand(brand: Brand): void {
    this.brand.set(brand);
  }

  setColorScheme(scheme: ColorScheme): void {
    this.colorScheme.set(scheme);
  }

  toggleColorScheme(): void {
    this.colorScheme.update((s) => (s === 'dark' ? 'light' : 'dark'));
  }

  private readBrand(): Brand {
    const stored = this.read(BRAND_STORAGE_KEY);
    if (isBrand(stored)) {
      return stored;
    }
    return this.defaults.brand ?? 'brand-1';
  }

  private readColorScheme(): ColorScheme {
    const stored = this.read(SCHEME_STORAGE_KEY);
    if (isColorScheme(stored)) {
      return stored;
    }
    if (this.defaults.colorScheme) {
      return this.defaults.colorScheme;
    }
    if (
      this.isBrowser &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
    return 'light';
  }

  private read(key: string): string | null {
    if (!this.isBrowser) {
      return null;
    }
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private persist(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* storage unavailable (private mode, blocked) — state still lives in memory */
    }
  }
}

function isBrand(value: string | null): value is Brand {
  return value !== null && (KNOWN_BRANDS as readonly string[]).includes(value);
}

function isColorScheme(value: string | null): value is ColorScheme {
  return value !== null && (KNOWN_SCHEMES as readonly string[]).includes(value);
}
