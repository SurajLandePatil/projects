import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicDetailDialogComponent } from './mechanic-detail-dialog.component';

describe('MechanicDetailDialogComponent', () => {
  let component: MechanicDetailDialogComponent;
  let fixture: ComponentFixture<MechanicDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MechanicDetailDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MechanicDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
