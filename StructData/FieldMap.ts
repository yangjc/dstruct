/**
 * YJC <yangjiecong@live.com> @2017-11-03
 */

'use strict';

import { StructData, SameKeysObject, MappedFields, FieldsData, Data } from './index';

type Keys<X extends string, Y extends string> = {
    [K in X]? : Y;
};

export class StructFieldMap<F extends string, D, V extends SameKeysObject<D>> {

    readonly name: string;
    readonly fields: MappedFields<keyof D, F>;

    private keys: Keys<F, keyof D> = {};
    private StructDataCtor: {new(...args: any[]): StructData<D, V>};

    constructor(fields: MappedFields<keyof D, F>,
                name: string,
                StructDataCtor?: {new(...args: any[]): StructData<D, V>}) {
        this.name = name;
        this.fields = fields;
        this.StructDataCtor = StructDataCtor;
        let key: keyof D;
        for (key in fields) {
            let field: F = fields[key];
            if (this.keys.hasOwnProperty(field)) {
                throw new Error(`duplicated field "${field}" on "${this.keys[field]}" and "${key}"`);
            }
            this.keys[field] = key;
        }
    }

    public queryData(data: FieldsData<F>): StructData<D, V> {
        let d: StructData<D, V> = new this.StructDataCtor();
        let v: Data<V> = {};
        for (let field in data) {
            if (!this.keys.hasOwnProperty(field)) {
                throw new Error(`undefined field "${field}"`);
            }
            v[this.keys[<F>field]] = data[field];
        }
        d.setValue(v);
        return d;
    }

    public queryOneFromList(data: FieldsData<F>[], index: number = 0): StructData<D, V> {
        return data[index]
            ? this.queryData(data[index])
            : null;
    }

    public queryDataList(data: FieldsData<F>[]): StructData<D, V>[] {
        return data.map(item => this.queryData(item));
    }

    public mapData(data: StructData<D, V>, fields?: F[]): FieldsData<F> {
        let d: FieldsData<F> = {};
        let v: Data<V> = data.getValue();
        for (let key in v) {
            let field: F = this.fields[<keyof D>key];
            if (field === undefined) {
                throw new Error(`not mapped key "${key}"`);
            }
            if (!fields || fields.indexOf(field) > -1) {
                d[field] = v[key];
            }
        }
        return d;
    }

}
