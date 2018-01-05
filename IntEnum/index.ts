/**
 * YJC <yangjiecong@live.com> @2017-11-20
 */

'use strict';

export declare type EnumValues<T extends string> = {
    [K in T]: number;
};

export declare type EnumNames<T extends string> = {
    [K in T]: K;
};

type Indexes<T extends string> = {
    [value: number]: T;
};

export class IntEnum<T extends string> {

    readonly    max         : number;
    readonly    names       : EnumNames<T>;
    readonly    values      : EnumValues<T>;

    private     indexes     : Indexes<T> = {};

    constructor(maxValue: number, names: EnumNames<T>, values: EnumValues<T>) {
        this.max = maxValue;
        this.names = names;
        this.values = values;

        for (let name in values) {
            if (name !== names[name]) {
                throw new Error(`name list error: ${name}=${names[name]}`);
            }
        }

        for (let name in values) {
            let v: number = values[name];
            if (!Number.isInteger(v) || v < 0) {
                throw new RangeError(`value of name should be zero or positive integer`);
            }
            if (v > maxValue) {
                throw new RangeError(`value should not be bigger than ${maxValue}`);
            }
            if (this.indexes.hasOwnProperty(v)) {
                throw new Error(`duplicated value "${v}" in "${this.indexes[v]}" and "${name}"`);
            }
            this.indexes[values[name]] = name;
        }

    }

    public getValue(name: string): number {
        if (!this.values.hasOwnProperty(name)) {
            throw new Error(`undefined name "${name}"`);
        }
        return this.values[<T>name];
    }

    public getName(value: number): T {
        if (!this.indexes.hasOwnProperty(value)) {
            throw new Error(`undefined value "${value}"`);
        }
        return <T>this.indexes[value];
    }

    public hasName(name: string): boolean {
        return this.values.hasOwnProperty(name);
    }

    public hasValue(value: number): boolean {
        return this.indexes.hasOwnProperty(value);
    }

}
