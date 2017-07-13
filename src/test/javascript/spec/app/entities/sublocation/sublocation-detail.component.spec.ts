import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { BuildingsouqTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { SublocationDetailComponent } from '../../../../../../main/webapp/app/entities/sublocation/sublocation-detail.component';
import { SublocationService } from '../../../../../../main/webapp/app/entities/sublocation/sublocation.service';
import { Sublocation } from '../../../../../../main/webapp/app/entities/sublocation/sublocation.model';

describe('Component Tests', () => {

    describe('Sublocation Management Detail Component', () => {
        let comp: SublocationDetailComponent;
        let fixture: ComponentFixture<SublocationDetailComponent>;
        let service: SublocationService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [BuildingsouqTestModule],
                declarations: [SublocationDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    SublocationService,
                    JhiEventManager
                ]
            }).overrideTemplate(SublocationDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SublocationDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SublocationService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Sublocation(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.sublocation).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
