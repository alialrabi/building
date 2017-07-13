import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BuildingsouqSharedModule } from '../../shared';
import {
    SublocationService,
    SublocationPopupService,
    SublocationComponent,
    SublocationDetailComponent,
    SublocationDialogComponent,
    SublocationPopupComponent,
    SublocationDeletePopupComponent,
    SublocationDeleteDialogComponent,
    sublocationRoute,
    sublocationPopupRoute,
    SublocationResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...sublocationRoute,
    ...sublocationPopupRoute,
];

@NgModule({
    imports: [
        BuildingsouqSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        SublocationComponent,
        SublocationDetailComponent,
        SublocationDialogComponent,
        SublocationDeleteDialogComponent,
        SublocationPopupComponent,
        SublocationDeletePopupComponent,
    ],
    entryComponents: [
        SublocationComponent,
        SublocationDialogComponent,
        SublocationPopupComponent,
        SublocationDeleteDialogComponent,
        SublocationDeletePopupComponent,
    ],
    providers: [
        SublocationService,
        SublocationPopupService,
        SublocationResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BuildingsouqSublocationModule {}
