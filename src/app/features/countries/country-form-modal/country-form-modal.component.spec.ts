import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryFormModalComponent } from './country-form-modal.component';

describe('CountryFormModalComponent', () => {
  let component: CountryFormModalComponent;
  let fixture: ComponentFixture<CountryFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
