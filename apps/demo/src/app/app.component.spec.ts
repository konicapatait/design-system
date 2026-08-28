import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule.forRoot([])],
      providers: [provideNoopAnimations()],
    }).compileComponents();
  });

  it('renders the app shell with the brand mark', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.shell__bar')).toBeTruthy();
    expect(compiled.textContent).toContain('Compliance Console');
    expect(compiled.querySelector('.shell__nav')).toBeTruthy();
  });
});
