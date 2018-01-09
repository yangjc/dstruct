/**
 * YJC <yangjiecong@live.com> @2017-11-03
 */

'use strict';

import { StructDataTypes } from './index';

export declare namespace FieldMapTypes {

    export type Fields<X, Y extends string> = {
        [K in keyof X]: Y;
    };

    export type Keys<X extends string, Y> = {
        [K in X]? : keyof Y;
    };

    export type MappedObject<S> = {
        [K in keyof S]: any;
    };

    export type MappedData<T extends string> = {
        [K in T]?: any;
    };

}

export class StructFieldMap<F extends string, S, V extends FieldMapTypes.MappedObject<S>> {

    readonly name: string;
    readonly fields: FieldMapTypes.Fields<S, F>;

    protected keys: FieldMapTypes.Keys<F, S> = {};

    constructor(fields: FieldMapTypes.Fields<S, F>, name: string) {
        this.name = name;
        this.fields = fields;
        let key: keyof S;
        for (key in fields) {
            let field: F = fields[key];
            if (this.keys.hasOwnProperty(field)) {
                throw new Error(`duplicated field "${field}" on "${this.keys[field]}" and "${key}"`);
            }
            this.keys[field] = key;
        }
    }

    public queryData(data: FieldMapTypes.MappedData<F>): StructDataTypes.Data<V> {
        let d: StructDataTypes.Data<V> = {};
        for (let field in data) {
            if (!this.keys.hasOwnProperty(field)) {
                throw new Error(`undefined field "${field}"`);
            }
            d[this.keys[<F>field]] = data[field];
        }
        return d;
    }

    public mapData(data: StructDataTypes.Data<V>, fields?: F[]): FieldMapTypes.MappedData<F> {
        let d: FieldMapTypes.MappedData<F> = {};
        for (let key in data) {
            let field: F = this.fields[<keyof S>key];
            if (field === undefined) {
                throw new Error(`not mapped key "${key}"`);
            }
            if (!fields || fields.indexOf(field) > -1) {
                d[field] = data[key];
            }
        }
        return d;
    }

}
