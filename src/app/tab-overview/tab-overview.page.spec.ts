import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabOverviewPage } from './tab-overview.page';

describe('TabOverviewPage', () => {
  let component: TabOverviewPage;
  let fixture: ComponentFixture<TabOverviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabOverviewPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
