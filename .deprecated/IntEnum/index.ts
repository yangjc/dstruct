/**
 * YJC <yangjiecong@live.com> @2017-10-18
 */

'use strict';

export declare namespace IntEnumTypes {

    export type EnumValues<T extends string> = {
        [K in T]: number;
    };

    export type EnumNames<T extends string> = {
        [K in T]: K;
    };

}

declare namespace Types {

    export interface Indexes {
        [value: number]: string;
    }

    export interface Values {
        [name: string]: number;
    }

    export interface Names {
        [name: string]: string;
    }

}

export function initIntEnum<T extends string>
(maxValue: number, values: IntEnumTypes.EnumValues<T>, names: IntEnumTypes.EnumNames<T>) {

    const inner = (function () {

        for (let name in values) {
            if (name !== names[name]) {
                throw new Error(`name list error: ${name}=${names[name]}`);
            }
        }

        let indexes: Types.Indexes = {};
        for (let name in values) {
            let v: number = values[name];
            if (!Number.isInteger(v) || v < 0) {
                throw new RangeError(`value of name should be zero or positive integer`);
            }
            if (v > maxValue) {
                throw new RangeError(`value should not be bigger than ${maxValue}`);
            }
            if (indexes.hasOwnProperty(v)) {
                throw new Error(`duplicated value "${v}" in "${indexes[v]}" and "${name}"`);
            }
            indexes[values[name]] = name;
        }

        return {
            indexes
        };

    })();

    return function classDecorator<C extends {new(...args: any[]): IntEnum<T>}>(Ctor: C) {

        return class extends Ctor {

            readonly  names     : Types.Names   = names;
            readonly  values    : Types.Values  = values;
            readonly  max       : number        = maxValue;

            protected indexes   : Types.Indexes = inner.indexes;

            constructor(...args: any[]) {
                super(...args);
                if (args[0] !== undefined) {
                    if (!this.has(args[0])) {
                        throw new TypeError(`undefined name "${args[0]}"`);
                    }
                    this.name = args[0];
                }
            }
        };

    };

}

export class IntEnum<T extends string> {

    public      name        : T;

    readonly    max         : number;
    readonly    values      : Types.Values;
    readonly    names       : Types.Names;

    protected   indexes     : Types.Indexes;

    constructor(name?: T) {}

    public getValue(): number {
        return this.hasOwnProperty('name') ? this.get(this.name) : -1;
    }

    public has(name: string): boolean {
        return this.values.hasOwnProperty(name);
    }

    public get(name: string): number {
        return this.values.hasOwnProperty(name) ? this.values[name] : -1;
    }

    public set(value: number): T {
        const name: string = this.getName(value);
        if (name === undefined) {
            throw new Error(`set value "${value}" failed`);
        }
        return this.name = <T>name;
    }

    public getName(index: number): string | undefined {
        return this.indexes.hasOwnProperty(index.toString()) ? this.indexes[index] : undefined;
    }

}
