import { BaseEntity } from './../../shared';

export class Sublocation implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public locations?: BaseEntity[],
        public assets?: BaseEntity[],
    ) {
    }
}
