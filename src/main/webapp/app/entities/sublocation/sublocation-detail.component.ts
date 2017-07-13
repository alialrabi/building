import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager  } from 'ng-jhipster';

import { Sublocation } from './sublocation.model';
import { SublocationService } from './sublocation.service';

@Component({
    selector: 'jhi-sublocation-detail',
    templateUrl: './sublocation-detail.component.html'
})
export class SublocationDetailComponent implements OnInit, OnDestroy {

    sublocation: Sublocation;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private sublocationService: SublocationService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInSublocations();
    }

    load(id) {
        this.sublocationService.find(id).subscribe((sublocation) => {
            this.sublocation = sublocation;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSublocations() {
        this.eventSubscriber = this.eventManager.subscribe(
            'sublocationListModification',
            (response) => this.load(this.sublocation.id)
        );
    }
}
