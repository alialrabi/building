import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { BuildingsouqTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { AssetDetailComponent } from '../../../../../../main/webapp/app/entities/asset/asset-detail.component';
import { AssetService } from '../../../../../../main/webapp/app/entities/asset/asset.service';
import { Asset } from '../../../../../../main/webapp/app/entities/asset/asset.model';

describe('Component Tests', () => {

    describe('Asset Management Detail Component', () => {
        let comp: AssetDetailComponent;
        let fixture: ComponentFixture<AssetDetailComponent>;
        let service: AssetService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [BuildingsouqTestModule],
                declarations: [AssetDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    AssetService,
                    JhiEventManager
                ]
            }).overrideTemplate(AssetDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(AssetDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AssetService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Asset(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.asset).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
