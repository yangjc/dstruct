/**
 * YJC <yangjiecong@live.com> @2018-01-09
 */

'use strict';

/*
 * desc (description): 描述性数据，用于开发过程。
 * value: 可存储数据，用于数据传输、入库。
 */

export type DescData<T> = {
    [K in keyof T]? : T[K];
};

export type ValueData<T> = {
    [K in keyof T]? : any;
};

export interface Descriptor<D> {
    field?: string;

    getDefault?: () => D;
    getValue?: (desc: D) => any;
    parseValue?: (value: any) => D;
    getDesc?: (desc: D) => D;
}

type Descriptors<D> = {
    [K in keyof D]: Descriptor<D[K]>;
};

type Keys<D> = {
    [K in keyof D]?: K;
};

type Fields<D> = {
    [K in keyof D]?: string;
};

interface FieldKeyMap {
    [field: string]: string;
}

type ValueGetters<D> = {
    [K in keyof D]?: (desc: D[K]) => any;
};

type ValueParsers<D> = {
    [K in keyof D]?: (value: any) => D[K];
};

type DescGetters<D> = {
    [K in keyof D]?: (desc: D[K]) => D[K];
};

type Defaults<D> = {
    [K in keyof D]?: D[K];
};

const getter = (input: any): any => input;

export function getDescriptor(fieldName: string, descriptor?: Descriptor<any>): Descriptor<any> {
    return Object.assign({field: fieldName}, descriptor);
}

export class StructData<D> {

    readonly keys: Keys<D> = {};
    readonly fields: Fields<D> = {};
    readonly valueGetters: ValueGetters<D> = {};
    readonly valueParsers: ValueParsers<D> = {};
    readonly descGetters: DescGetters<D> = {};
    readonly defaults: Defaults<D> = {};
    readonly name: string;

    private fieldKeyMap: FieldKeyMap = {};

    constructor(descriptors: Descriptors<D>, name?: string) {
        for (let key in descriptors) {
            const descriptor = descriptors[key];

            this.keys[key] = key;
            this.fields[key] = descriptor.field || key;
            this.fieldKeyMap[descriptor.field || key] = key;

            this.valueGetters[key] = descriptor.getValue || getter;
            this.valueParsers[key] = descriptor.parseValue || getter;
            this.descGetters[key] = descriptor.getDesc || getter;

            descriptor.getDefault && Object.defineProperty(this.defaults, key, {
                get: descriptor.getDefault
            });

            name && (this.name = name);
        }
    }

    public getDescData(data: DescData<D>): DescData<D> {
        const d: DescData<D> = {};
        for (let key in data) {
            if (!this.keys.hasOwnProperty(key)) {
                throw new Error(`undefined key "${key}"`);
            }
            d[key] = this.descGetters[key](data[key]);
        }
        return d;
    }

    public getValueData(data: DescData<D>): ValueData<D> {
        const d: ValueData<D> = {};
        for (let key in data) {
            if (!this.keys.hasOwnProperty(key)) {
                throw new Error(`undefined key "${key}"`);
            }
            d[key] = this.valueGetters[key](data[key]);
        }
        return d;
    }

    public parseValueData(data: ValueData<D>): DescData<D> {
        const d: DescData<D> = {};
        for (let key in data) {
            if (!this.keys.hasOwnProperty(key)) {
                throw new Error(`undefined key "${key}"`);
            }
            d[key] = this.valueParsers[key](data[key]);
        }
        return d;
    }

    public queryData(data: any): DescData<D> {
        const d: DescData<D> = {};
        for (let field in data) {
            const key = <keyof D>this.fieldKeyMap[field];
            if (key === undefined) {
                throw new Error(`undefined field "${field}"`);
            }
            d[key] = this.valueParsers[key](data[field]);
        }
        return d;
    }

    public queryOneFromList(data: any[], index: number = 0): DescData<D> {
        return data[index]
            ? this.queryData(data[index])
            : null;
    }

    public queryDataList(data: any[]): DescData<D>[] {
        return data.map(item => this.queryData(item));
    }

    public mapData(data: DescData<D>, keys?: (keyof D)[]): any {
        const d: any = {};
        for (let key in data) {
            const field: string = this.fields[key];
            if (field === undefined) {
                throw new Error(`not mapped key "${key}"`);
            }
            if (!keys || keys.indexOf(key) > -1) {
                d[field] = this.valueGetters[key](data[key]);
            }
        }
        return d;
    }

}
