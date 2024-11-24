import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudyBodyComponent } from './cloudy-body.component';

describe('CloudyBodyComponent', () => {
  let component: CloudyBodyComponent;
  let fixture: ComponentFixture<CloudyBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloudyBodyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloudyBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
