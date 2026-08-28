import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DsButtonComponent } from './button.component';

@Component({
  standalone: true,
  imports: [DsButtonComponent],
  template: `
    <ds-button
      [variant]="variant"
      [size]="size"
      [loading]="loading"
      [disabled]="disabled"
      (clicked)="onClick()"
      >Go</ds-button
    >
  `,
})
class HostComponent {
  variant: 'primary' | 'secondary' | 'ghost' | 'link' | 'danger' = 'primary';
  size: 'sm' | 'md' | 'lg' = 'md';
  loading = false;
  disabled = false;
  clicks = 0;
  onClick(): void {
    this.clicks++;
  }
}

describe('DsButtonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
  });

  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const dsButton = host.querySelector('ds-button') as HTMLElement;
    const nativeButton = host.querySelector('button') as HTMLButtonElement;
    return { fixture, host, dsButton, nativeButton };
  }

  it('reflects variant and size onto the host for token targeting', () => {
    const { fixture, dsButton } = setup();
    fixture.componentInstance.variant = 'danger';
    fixture.componentInstance.size = 'lg';
    fixture.detectChanges();
    expect(dsButton.getAttribute('data-variant')).toBe('danger');
    expect(dsButton.getAttribute('data-size')).toBe('lg');
  });

  it('emits clicked when enabled', () => {
    const { fixture, nativeButton } = setup();
    nativeButton.click();
    expect(fixture.componentInstance.clicks).toBe(1);
  });

  it('does not emit clicked when disabled', () => {
    const { fixture, nativeButton } = setup();
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    nativeButton.click();
    expect(fixture.componentInstance.clicks).toBe(0);
    expect(nativeButton.disabled).toBe(true);
  });

  it('blocks interaction and sets aria-busy while loading', () => {
    const { fixture, nativeButton } = setup();
    fixture.componentInstance.loading = true;
    fixture.detectChanges();
    nativeButton.click();
    expect(fixture.componentInstance.clicks).toBe(0);
    expect(nativeButton.getAttribute('aria-busy')).toBe('true');
  });
});
