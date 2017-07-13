import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Sublocation } from './sublocation.model';
import { SublocationPopupService } from './sublocation-popup.service';
import { SublocationService } from './sublocation.service';

@Component({
    selector: 'jhi-sublocation-dialog',
    templateUrl: './sublocation-dialog.component.html'
})
export class SublocationDialogComponent implements OnInit {

    sublocation: Sublocation;
    authorities: any[];
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private sublocationService: SublocationService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.sublocation.id !== undefined) {
            this.subscribeToSaveResponse(
                this.sublocationService.update(this.sublocation), false);
        } else {
            this.subscribeToSaveResponse(
                this.sublocationService.create(this.sublocation), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<Sublocation>, isCreated: boolean) {
        result.subscribe((res: Sublocation) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Sublocation, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'buildingsouqApp.sublocation.created'
            : 'buildingsouqApp.sublocation.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'sublocationListModification', content: 'OK'});
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
}

@Component({
    selector: 'jhi-sublocation-popup',
    template: ''
})
export class SublocationPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private sublocationPopupService: SublocationPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.sublocationPopupService
                    .open(SublocationDialogComponent, params['id']);
            } else {
                this.modalRef = this.sublocationPopupService
                    .open(SublocationDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
