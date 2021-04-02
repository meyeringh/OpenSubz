import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UiPage } from './ui.page';

describe('UiPage', () => {
  let component: UiPage;
  let fixture: ComponentFixture<UiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
