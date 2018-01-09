/**
 * YJC <yangjiecong@live.com> @2017-10-18
 */

/*
 * structure (S): 结构化数据，开发过程使用
 * description (D): 描述性数据，用于手写初始数据、输出数据的可读形式
 * value (V): 可存储数据，用于数据传输、入库
 */

'use strict';

import { StructFieldMap, FieldMapTypes } from './FieldMap';
export { StructFieldMap, FieldMapTypes };

export declare namespace StructDataTypes {

    export type Data<T> = {
        [K in keyof T]? : T[K];
    };

    export interface Descriptor<TS> {

        default     : () => TS,

        // (structure) => description
        get         : (currentData: TS) => any,

        // (structure, description) => void
        set         : (currentData: TS, newData: any) => void,

        // (structure) => value
        getValue    : (currentData: TS) => any,

        // (structure, value) => void
        setValue    : (currentData: TS, newData: any) => void,

    }

    export type Descriptors<S> = {
        [K in keyof S]? : Descriptor<S[K]>;
    };

}

declare namespace Types {

    export interface InnerDescriptor<TS> {
        default?    : () => TS,
        get         : (currentData: TS) => any,
        set         : (currentData: TS, newData: any) => void,
    }

    export type InnerDescriptors<S> = {
        [K in keyof S]? : InnerDescriptor<S[K]>;
    };

}


export function initStructData<S, D, V extends FieldMapTypes.MappedObject<S>, F extends string = string>
(setter?: StructDataTypes.Descriptors<S>, fields?: FieldMapTypes.Fields<S, F>, name?: string) {

    const valueSetter = setter
        ? (function () {
            let _setter: any = {};
            let valueSetter: any = {};

            for (let name in setter) {
                valueSetter[name] = {
                    default: setter[name].default,
                    get: setter[name].getValue,
                    set: setter[name].setValue,
                };
                _setter[name] = {
                    get: setter[name].get,
                    set: setter[name].set,
                };
            }

            setter = _setter;

            return valueSetter;

        })()

        : null;

    const fieldMap: StructFieldMap<F, S, V> = fields ? new StructFieldMap<F, S, V>(fields, name) : null;

    return function classDecorator<T extends {new(...args: any[]): StructData<S, D, V>}>(Ctor: T) {

        return class C extends Ctor {

            constructor(...args: any[]) {
                super(...args);
                setter && this.init(setter, valueSetter);
                args[0] && this.setData(args[0]);
            }

            static queryData(data: FieldMapTypes.MappedData<F>): C {
                const c = new C();
                c.setValue(fieldMap.queryData(data));
                return c;
            }

            static mapData(data: C): FieldMapTypes.MappedData<F> {
                return fieldMap.mapData(data.getValue());
            }

            static fieldMap: StructFieldMap<F, S, V> = fieldMap;

        };

    };

}

export class StructData<S, D, V> {

    public      data    : any = {}; // D

    private     _data   : any;
    private     setter  : any;

    constructor(data? : StructDataTypes.Data<D>) {}

    private getGetter(name: string, getter: Function): () => any {
        return (): any => {
            return this._data.hasOwnProperty(name)
                ? getter(this._data[name])
                : undefined;
        };
    }

    private getSetter(name: string, setter: Function): (d: any) => void {
        return (data: any): void => {
            if (!this._data.hasOwnProperty(name)) {
                this._data[name] = this.setter[name].default();
            }
            setter(this._data[name], data);
        };
    }

    protected init(setter: Types.InnerDescriptors<S>, valueSetter: Types.InnerDescriptors<S>) {
        this._data = {};
        this.setter = valueSetter;

        for (let name in setter) {
            Object.defineProperty(this.data, name, {
                configurable: false,
                enumerable: true,
                get: this.getGetter(name, setter[name].get),
                set: this.getSetter(name, setter[name].set),
            });
        }
    }

    public setData(data: StructDataTypes.Data<D>): void {
        for (let name in data) {
            this.data[name] = data[name];
        }
    }

    public getData(): StructDataTypes.Data<D> {
        let d: StructDataTypes.Data<D> = {};
        for (let name in this.data) {
            let v: any = this.data[name];
            if (v !== undefined) {
                d[<keyof D>name] = v;
            }
        }
        return d;
    }

    public setValue(data: StructDataTypes.Data<V>): void {
        for (let name in data) {
            if (this.setter && this.setter.hasOwnProperty(name)) {
                if (!this._data.hasOwnProperty(name)) {
                    this._data[name] = this.setter[name].default();
                }
                this.setter[name].set(this._data[name], data[name]);
            } else {
                this.data[name] = data[name];
            }
        }
    }

    public getValueOf(name: keyof D): any {
        return this.setter && this.setter.hasOwnProperty(name)
            ? (this._data.hasOwnProperty(name)
                ? this.setter[name].get(this._data[name])
                : undefined)
            : this.data[name];
    }

    public getValue(): StructDataTypes.Data<V> {
        let value: any = {};
        for (let name in this.data) {
            let v: any = this.getValueOf(<keyof D>name);
            if (v !== undefined) {
                value[name] = v;
            }
        }
        return value;
    }

    static queryData: (data: any) => any;
    static mapData: (data: any) => any;
    static fieldMap: any;

}
