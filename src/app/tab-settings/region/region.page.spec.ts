import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegionPage } from './region.page';

describe('RegionPage', () => {
    let component: RegionPage;
    let fixture: ComponentFixture<RegionPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [RegionPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(RegionPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
