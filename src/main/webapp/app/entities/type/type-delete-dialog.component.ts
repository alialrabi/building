import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Type } from './type.model';
import { TypePopupService } from './type-popup.service';
import { TypeService } from './type.service';

@Component({
    selector: 'jhi-type-delete-dialog',
    templateUrl: './type-delete-dialog.component.html'
})
export class TypeDeleteDialogComponent {

    type: Type;

    constructor(
        private typeService: TypeService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.typeService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'typeListModification',
                content: 'Deleted an type'
            });
            this.activeModal.dismiss(true);
        });
        this.alertService.success('buildingsouqApp.type.deleted', { param : id }, null);
    }
}

@Component({
    selector: 'jhi-type-delete-popup',
    template: ''
})
export class TypeDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private typePopupService: TypePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.typePopupService
                .open(TypeDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
