import { BaseEntity } from './../../shared';

export class Type implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public assets?: BaseEntity[],
    ) {
    }
}
