import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackBtnComponent } from './back-btn.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

describe('BackBtnComponent', () => {
  let component: BackBtnComponent;
  let fixture: ComponentFixture<BackBtnComponent>;
  let locationSpy: jasmine.SpyObj<Location>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    locationSpy = jasmine.createSpyObj('Location', ['back']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [BackBtnComponent],
      providers: [
        { provide: Location, useValue: locationSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BackBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clicked event on back', () => {
    spyOn(component.clicked, 'emit');
    component.onBack();
    expect(component.clicked.emit).toHaveBeenCalled();
  });

  it('should call location.back() when route is not provided', () => {
    component.route = undefined;
    component.onBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });

  it('should call router.navigate() when route is an array', () => {
    component.route = ['/dashboard'];
    component.onBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should call router.navigateByUrl() when route is a string', () => {
    component.route = '/dashboard';
    component.onBack();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });
});
