import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DataManagementPage } from './data-management.page';

describe('DataManagementPage', () => {
  let component: DataManagementPage;
  let fixture: ComponentFixture<DataManagementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataManagementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DataManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
