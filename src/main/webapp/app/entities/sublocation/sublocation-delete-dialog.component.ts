import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Sublocation } from './sublocation.model';
import { SublocationPopupService } from './sublocation-popup.service';
import { SublocationService } from './sublocation.service';

@Component({
    selector: 'jhi-sublocation-delete-dialog',
    templateUrl: './sublocation-delete-dialog.component.html'
})
export class SublocationDeleteDialogComponent {

    sublocation: Sublocation;

    constructor(
        private sublocationService: SublocationService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.sublocationService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'sublocationListModification',
                content: 'Deleted an sublocation'
            });
            this.activeModal.dismiss(true);
        });
        this.alertService.success('buildingsouqApp.sublocation.deleted', { param : id }, null);
    }
}

@Component({
    selector: 'jhi-sublocation-delete-popup',
    template: ''
})
export class SublocationDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private sublocationPopupService: SublocationPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.sublocationPopupService
                .open(SublocationDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
