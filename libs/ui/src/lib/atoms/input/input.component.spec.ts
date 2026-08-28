import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DsInputComponent } from './input.component';

@Component({
  standalone: true,
  imports: [DsInputComponent, ReactiveFormsModule],
  template: `<ds-input [formControl]="control" [status]="status" />`,
})
class HostComponent {
  control = new FormControl('initial');
  status: 'default' | 'error' | 'warning' | 'success' = 'default';
}

describe('DsInputComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
  });

  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const input = host.querySelector('input') as HTMLInputElement;
    return { fixture, host, input };
  }

  it('writes the initial form value into the field', () => {
    const { input } = setup();
    expect(input.value).toBe('initial');
  });

  it('propagates typing back to the form control', () => {
    const { fixture, input } = setup();
    input.value = 'hello';
    input.dispatchEvent(new Event('input'));
    expect(fixture.componentInstance.control.value).toBe('hello');
  });

  it('honours the disabled state from the form control', () => {
    const { fixture, input } = setup();
    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    expect(input.disabled).toBe(true);
  });

  it('exposes an error status for token styling and a11y', () => {
    const { fixture, host, input } = setup();
    fixture.componentInstance.status = 'error';
    fixture.detectChanges();
    expect(host.querySelector('ds-input')?.getAttribute('data-status')).toBe('error');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });
});
