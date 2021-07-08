import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CochesReservadosComponent } from './coches-reservados.component';

describe('CochesReservadosComponent', () => {
  let component: CochesReservadosComponent;
  let fixture: ComponentFixture<CochesReservadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CochesReservadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CochesReservadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
