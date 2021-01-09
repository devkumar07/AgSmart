import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgsmartLoginComponent } from './agsmart-login.component';

describe('AgsmartLoginComponent', () => {
  let component: AgsmartLoginComponent;
  let fixture: ComponentFixture<AgsmartLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgsmartLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgsmartLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
