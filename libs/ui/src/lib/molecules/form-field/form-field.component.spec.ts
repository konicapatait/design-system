import { TestBed } from '@angular/core/testing';
import { DsFormFieldComponent } from './form-field.component';

describe('DsFormFieldComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsFormFieldComponent],
    }).compileComponents();
  });

  it('renders the hint and points describedBy at it', () => {
    const fixture = TestBed.createComponent(DsFormFieldComponent);
    fixture.componentRef.setInput('label', 'Email');
    fixture.componentRef.setInput('hint', 'Work address preferred.');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const hint = el.querySelector('.ds-field__message--hint');
    expect(hint?.textContent).toContain('Work address preferred.');
    expect(fixture.componentInstance.describedBy()).toBe(fixture.componentInstance.hintId);
  });

  it('swaps hint for an alert-role error message when invalid', () => {
    const fixture = TestBed.createComponent(DsFormFieldComponent);
    fixture.componentRef.setInput('hint', 'Work address preferred.');
    fixture.componentRef.setInput('error', 'Enter a valid email.');
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const error = el.querySelector('.ds-field__message--error');
    expect(error?.getAttribute('role')).toBe('alert');
    expect(el.querySelector('.ds-field__message--hint')).toBeNull();
    expect(fixture.componentInstance.describedBy()).toBe(fixture.componentInstance.errorId);
  });

  it('marks the label required', () => {
    const fixture = TestBed.createComponent(DsFormFieldComponent);
    fixture.componentRef.setInput('label', 'Name');
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.ds-field__required')?.textContent).toContain('*');
  });
});
