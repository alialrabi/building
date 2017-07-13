import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { TypeComponent } from './type.component';
import { TypeDetailComponent } from './type-detail.component';
import { TypePopupComponent } from './type-dialog.component';
import { TypeDeletePopupComponent } from './type-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class TypeResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
      };
    }
}

export const typeRoute: Routes = [
    {
        path: 'type',
        component: TypeComponent,
        resolve: {
            'pagingParams': TypeResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'buildingsouqApp.type.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'type/:id',
        component: TypeDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'buildingsouqApp.type.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const typePopupRoute: Routes = [
    {
        path: 'type-new',
        component: TypePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'buildingsouqApp.type.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'type/:id/edit',
        component: TypePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'buildingsouqApp.type.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'type/:id/delete',
        component: TypeDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'buildingsouqApp.type.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
