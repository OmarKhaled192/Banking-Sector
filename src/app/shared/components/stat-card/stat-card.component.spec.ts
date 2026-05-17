import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatCardComponent } from './stat-card.component';

describe('StatCardComponent', () => {
  let component: StatCardComponent;
  let fixture: ComponentFixture<StatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StatCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default inputs', () => {
    expect(component.label).toBe('');
    expect(component.value).toBe('');
    expect(component.sub).toBe('');
    expect(component.icon).toBe('pi-chart-bar');
    expect(component.iconColor).toBe('#6366f1');
    expect(component.iconBg).toBe('#eef2ff');
  });

  it('should update inputs correctly', () => {
    component.label = 'Total Sales';
    component.value = '$5,000';
    component.sub = '+5% from yesterday';
    component.icon = 'pi-dollar';
    fixture.detectChanges();

    expect(component.label).toBe('Total Sales');
    expect(component.value).toBe('$5,000');
    expect(component.sub).toBe('+5% from yesterday');
  });
});
