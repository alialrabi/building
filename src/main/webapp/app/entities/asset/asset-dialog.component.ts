import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Asset } from './asset.model';
import { AssetPopupService } from './asset-popup.service';
import { AssetService } from './asset.service';
import { Type, TypeService } from '../type';
import { Category, CategoryService } from '../category';
import { Location, LocationService } from '../location';
import { Sublocation, SublocationService } from '../sublocation';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-asset-dialog',
    templateUrl: './asset-dialog.component.html'
})
export class AssetDialogComponent implements OnInit {

    asset: Asset;
    authorities: any[];
    isSaving: boolean;

    types: Type[];

    categories: Category[];

    locations: Location[];

    sublocations: Sublocation[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private assetService: AssetService,
        private typeService: TypeService,
        private categoryService: CategoryService,
        private locationService: LocationService,
        private sublocationService: SublocationService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.typeService.query()
            .subscribe((res: ResponseWrapper) => { this.types = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.categoryService.query()
            .subscribe((res: ResponseWrapper) => { this.categories = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.locationService.query()
            .subscribe((res: ResponseWrapper) => { this.locations = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.sublocationService.query()
            .subscribe((res: ResponseWrapper) => { this.sublocations = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.asset.id !== undefined) {
            this.subscribeToSaveResponse(
                this.assetService.update(this.asset), false);
        } else {
            this.subscribeToSaveResponse(
                this.assetService.create(this.asset), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<Asset>, isCreated: boolean) {
        result.subscribe((res: Asset) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Asset, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'buildingsouqApp.asset.created'
            : 'buildingsouqApp.asset.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'assetListModification', content: 'OK'});
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

    trackTypeById(index: number, item: Type) {
        return item.id;
    }

    trackCategoryById(index: number, item: Category) {
        return item.id;
    }

    trackLocationById(index: number, item: Location) {
        return item.id;
    }

    trackSublocationById(index: number, item: Sublocation) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-asset-popup',
    template: ''
})
export class AssetPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private assetPopupService: AssetPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.assetPopupService
                    .open(AssetDialogComponent, params['id']);
            } else {
                this.modalRef = this.assetPopupService
                    .open(AssetDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
