import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { SublocationComponent } from './sublocation.component';
import { SublocationDetailComponent } from './sublocation-detail.component';
import { SublocationPopupComponent } from './sublocation-dialog.component';
import { SublocationDeletePopupComponent } from './sublocation-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class SublocationResolvePagingParams implements Resolve<any> {

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

export const sublocationRoute: Routes = [
    {
        path: 'sublocation',
        component: SublocationComponent,
        resolve: {
            'pagingParams': SublocationResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'buildingsouqApp.sublocation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'sublocation/:id',
        component: SublocationDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'buildingsouqApp.sublocation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const sublocationPopupRoute: Routes = [
    {
        path: 'sublocation-new',
        component: SublocationPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'buildingsouqApp.sublocation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'sublocation/:id/edit',
        component: SublocationPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'buildingsouqApp.sublocation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'sublocation/:id/delete',
        component: SublocationDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'buildingsouqApp.sublocation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
