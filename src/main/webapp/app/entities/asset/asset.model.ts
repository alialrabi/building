import { BaseEntity } from './../../shared';

export class Asset implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public telephone?: string,
        public email?: string,
        public details?: string,
        public address?: string,
        public image?: string,
        public map?: string,
        public type?: BaseEntity,
        public category?: BaseEntity,
        public location?: BaseEntity,
        public sublocation?: BaseEntity,
    ) {
    }
}
