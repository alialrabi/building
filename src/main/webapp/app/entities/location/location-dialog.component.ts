import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Location } from './location.model';
import { LocationPopupService } from './location-popup.service';
import { LocationService } from './location.service';
import { Sublocation, SublocationService } from '../sublocation';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-location-dialog',
    templateUrl: './location-dialog.component.html'
})
export class LocationDialogComponent implements OnInit {

    location: Location;
    authorities: any[];
    isSaving: boolean;

    sublocations: Sublocation[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private locationService: LocationService,
        private sublocationService: SublocationService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.sublocationService.query()
            .subscribe((res: ResponseWrapper) => { this.sublocations = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.location.id !== undefined) {
            this.subscribeToSaveResponse(
                this.locationService.update(this.location), false);
        } else {
            this.subscribeToSaveResponse(
                this.locationService.create(this.location), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<Location>, isCreated: boolean) {
        result.subscribe((res: Location) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Location, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'buildingsouqApp.location.created'
            : 'buildingsouqApp.location.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'locationListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    trackSublocationById(index: number, item: Sublocation) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-location-popup',
    template: ''
})
export class LocationPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private locationPopupService: LocationPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.locationPopupService
                    .open(LocationDialogComponent, params['id']);
            } else {
                this.modalRef = this.locationPopupService
                    .open(LocationDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
