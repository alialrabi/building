import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BuildingsouqSharedModule } from '../../shared';
import {
    TypeService,
    TypePopupService,
    TypeComponent,
    TypeDetailComponent,
    TypeDialogComponent,
    TypePopupComponent,
    TypeDeletePopupComponent,
    TypeDeleteDialogComponent,
    typeRoute,
    typePopupRoute,
    TypeResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...typeRoute,
    ...typePopupRoute,
];

@NgModule({
    imports: [
        BuildingsouqSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        TypeComponent,
        TypeDetailComponent,
        TypeDialogComponent,
        TypeDeleteDialogComponent,
        TypePopupComponent,
        TypeDeletePopupComponent,
    ],
    entryComponents: [
        TypeComponent,
        TypeDialogComponent,
        TypePopupComponent,
        TypeDeleteDialogComponent,
        TypeDeletePopupComponent,
    ],
    providers: [
        TypeService,
        TypePopupService,
        TypeResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BuildingsouqTypeModule {}
