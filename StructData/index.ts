/**
 * YJC <yangjiecong@live.com> @2017-10-18
 */

/*
 * description (D): 描述性数据，用于开发过程
 * value (V): 可存储数据，用于数据传输、入库
 */

'use strict';

import { StructFieldMap } from './FieldMap';
export { StructFieldMap };

export declare type Data<T> = {
    [K in keyof T]? : T[K];
};

export declare type SameKeysObject<O> = {
    [K in keyof O]: any;
};

export declare type FieldsData<T extends string> = {
    [K in T]?: any;
};

export declare interface Descriptor<D, V> {
    default     : () => D,
    get         : (currentData: D) => D,
    set         : (currentData: D, newData: D) => D,
    getValue    : (currentData: D) => V,
    setValue    : (currentData: D, newData: V) => D,
}

export declare type Descriptors<D, V extends SameKeysObject<D>> = {
    [K in keyof D]? : Descriptor<D[K], V[K]>;
};

export declare type MappedFields<X extends string, Y extends string> = {
    [K in X]: Y;
};


interface InnerDescriptor<D, ND> {
    default?    : () => D,
    get         : (currentData: D) => ND,
    set         : (currentData: D, newData: ND) => D,
}

type InnerDescriptors<D, ND extends SameKeysObject<D>> = {
    [K in keyof D]? : InnerDescriptor<D[K], ND[K]>;
};


export function initStructData<D, V extends SameKeysObject<D>>
(descriptors?: Descriptors<D, V>) {

    const valueDescriptors = descriptors
        ? (function () {
            let _setter: any = {};
            let valueDescriptors: any = {};

            for (let name in descriptors) {
                valueDescriptors[name] = {
                    default: descriptors[name].default,
                    get: descriptors[name].getValue,
                    set: descriptors[name].setValue,
                };
                _setter[name] = {
                    get: descriptors[name].get,
                    set: descriptors[name].set,
                };
            }

            descriptors = _setter;

            return valueDescriptors;

        })()

        : null;

    type TStructData = StructData<D, V>;

    return function classDecorator<T extends {new(...args: any[]): TStructData}>(Ctor: T) {

        return class StructData extends Ctor {

            constructor(...args: any[]) {
                super(...args);
                descriptors && this.init(descriptors, valueDescriptors);
                args[0] && this.setData(args[0]);
            }

        };

    };

}

export class StructData<D, V extends SameKeysObject<D>> {

    public      data    : Data<D> = {}; // D

    private     _data   : any;
    private     descriptors  : any;

    constructor(data? : Data<D>) {}

    private getGetter(name: string, getter: Function): () => any {
        return (): any => {
            return this._data.hasOwnProperty(name)
                ? getter(this._data[name])
                : undefined;
        };
    }

    private getSetter(name: string, descriptors: Function): (d: any) => void {
        return (data: any): void => {
            this._data[name] = descriptors(
                this._data.hasOwnProperty(name) ? this._data[name] : this.descriptors[name].default(),
                data
            );
        };
    }

    protected init(descriptors: InnerDescriptors<D, D>, valueDescriptors: InnerDescriptors<D, V>) {
        this._data = {};
        this.descriptors = valueDescriptors;

        for (let name in descriptors) {
            Object.defineProperty(this.data, name, {
                configurable: false,
                enumerable: true,
                get: this.getGetter(name, descriptors[name].get),
                set: this.getSetter(name, descriptors[name].set),
            });
        }
    }

    public setData(data: Data<D>): void {
        for (let name in data) {
            this.data[name] = data[name];
        }
    }

    public getData(): Data<D> {
        let d: Data<D> = {};
        for (let name in this.data) {
            let v: any = this.data[name];
            if (v !== undefined) {
                d[<keyof D>name] = v;
            }
        }
        return d;
    }

    public setValue(data: Data<V>): void {
        for (let name in data) {
            if (this.descriptors && this.descriptors.hasOwnProperty(name)) {
                this._data[name] = this.descriptors[name].set(
                    this._data.hasOwnProperty(name) ? this._data[name] : this.descriptors[name].default(),
                    data[name]
                );
            } else {
                this.data[<keyof D>name] = data[name];
            }
        }
    }

    public getValueOf(name: keyof D): any {
        return this.descriptors && this.descriptors.hasOwnProperty(name)
            ? (this._data.hasOwnProperty(name)
                ? this.descriptors[name].get(this._data[name])
                : undefined)
            : this.data[name];
    }

    public getValue(): Data<V> {
        let value: any = {};
        for (let name in this.data) {
            let v: any = this.getValueOf(<keyof D>name);
            if (v !== undefined) {
                value[name] = v;
            }
        }
        return value;
    }

    public has(name: keyof D): boolean {
        return this.descriptors && this.descriptors.hasOwnProperty(name)
            ? this._data.hasOwnProperty(name)
            : this.data.hasOwnProperty(name);
    }

}
