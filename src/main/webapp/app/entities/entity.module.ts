import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BuildingsouqTypeModule } from './type/type.module';
import { BuildingsouqCategoryModule } from './category/category.module';
import { BuildingsouqLocationModule } from './location/location.module';
import { BuildingsouqSublocationModule } from './sublocation/sublocation.module';
import { BuildingsouqAssetModule } from './asset/asset.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        BuildingsouqTypeModule,
        BuildingsouqCategoryModule,
        BuildingsouqLocationModule,
        BuildingsouqSublocationModule,
        BuildingsouqAssetModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BuildingsouqEntityModule {}
