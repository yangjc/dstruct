/**
 * YJC <yangjiecong@live.com> @2017-10-19
 */

'use strict';

const [ MAX_BITS_LENGTH, MAX_VALUE ] = (function () {
    let i: number = 0;
    let b: number = 1;
    let sum: number = 0;
    do {
        i++;
        sum += b;
    } while ((b = b << 1).toString(2).length === i + 1);
    return [i, sum];
})();

export declare namespace BitsIntTypes {

    export interface Property {
        bitPosition: number;
        defaultValue: boolean;
    }

    export interface Properties {
        [propertyName: string]: Property;
    }

    export type Description<D> = {
        [P in keyof D]? : boolean;
    };

}

export function initBitsInt<D, P> (bitsLength: number, properties: P & BitsIntTypes.Properties) {

    const inner = (function () {

        if (!Number.isInteger(bitsLength) || bitsLength <= 0) {
            throw new TypeError(`bits length should be positive integer`);
        }
        if (bitsLength > MAX_BITS_LENGTH) {
            throw new RangeError(`bits length should not bigger than ${MAX_BITS_LENGTH}`);
        }

        let desc: BitsIntTypes.Description<D> = {};

        let count = 0;
        let positions: string[] = [];

        for (let property of Object.getOwnPropertyNames(properties)) {
            let { bitPosition, defaultValue } = properties[property];

            if (!Number.isInteger(bitPosition) || bitPosition < 0 || bitPosition >= bitsLength) {
                throw new TypeError(`bit position of property "${property}" is out of range`);
            }
            if (positions.hasOwnProperty(bitPosition)) {
                throw new Error(`duplicated bit position "${bitPosition}"`
                    + ` from "${positions[bitPosition]}" and "${property}"`);
            }
            positions[bitPosition] = property;
            desc[<keyof D>property] = defaultValue;

            ++count;
        }

        if (count > bitsLength) {
            throw new RangeError(`count of properties should not bigger than bits length`);
        }

        let bits: number[] = new Array(bitsLength);

        let b: number = 1;
        for (let i = 0; i < bitsLength; i++) {
            bits[i] = b;
            b = b << 1;
        }

        let max: number = bitsLength === MAX_BITS_LENGTH ? MAX_VALUE : b - 1;

        return {
            bits,
            max,
            desc,
        }
    })();

    return function classDecorator<T extends {new(...args: any[]): BitsInt<D>}>(Ctor: T) {

        return class extends Ctor {

            readonly  bitsLength : number                = bitsLength;
            readonly  max        : number                = inner.max;

            protected bits       : number[]              = inner.bits;
            protected properties : BitsIntTypes.Properties     = properties;

            public    desc       : BitsIntTypes.Description<D> = Object.assign({}, inner.desc);

            constructor(...args: any[]) {
                super(...args);
                if (args[0] !== undefined) {
                    this.setDesc(args[0]);
                }
            }
        };

    };

}

export class BitsInt<D> {

    static    MAX_LENGTH : number = MAX_BITS_LENGTH;

    private   value      : number;

    protected bits       : number[];
    protected properties : BitsIntTypes.Properties;

    readonly  max        : number;
    readonly  bitsLength : number;

    public    desc       : BitsIntTypes.Description<D>;

    constructor(description?: BitsIntTypes.Description<D>) {}

    public getValue(): number {
        let value: number = 0;
        for (let property in this.desc) {
            if (this.properties.hasOwnProperty(property) && this.desc[property] === true) {
                value += this.bits[this.properties[property].bitPosition];
            }
        }
        return this.value = value;
    }

    public setDesc(description: BitsIntTypes.Description<D>): number {
        for (let property in description) {
            if (!this.properties.hasOwnProperty(property)) {
                throw new Error(`undefined property "${property}"`);
            }
            this.desc[property] = description[property];
        }
        return this.getValue();
    }

    public setValue(value: number): number {
        if (!Number.isInteger(value) || value < 0) {
            throw TypeError(`positive integer required`);
        }
        if (value > this.max) {
            throw RangeError(`value too large`);
        }

        for (let property in this.properties) {
            let b: number = this.bits[this.properties[property].bitPosition];
            this.desc[<keyof D>property] = (value & b) === b;
        }
        return this.value = value;
    }

    public getValueByDesc(description: BitsIntTypes.Description<D>): number {
        let value: number = 0;
        for (let property in description) {
            if (!this.properties.hasOwnProperty(property)) {
                throw new Error(`undefined property "${property}"`);
            }
            if (description[property]) {
                value += this.bits[this.properties[property].bitPosition];
            }
        }
        return value;
    }

    public getDescByValue(value: number): BitsIntTypes.Description<D> {
        if (!Number.isInteger(value) || value < 0) {
            throw TypeError(`positive integer required`);
        }
        if (value > this.max) {
            throw RangeError(`value too large`);
        }

        let description: BitsIntTypes.Description<D> = {};
        for (let property in this.properties) {
            let b: number = this.bits[this.properties[property].bitPosition];
            description[<keyof D>property] = (value & b) === b;
        }
        return description;
    }

    public print(): string {
        let d: (null | string)[] = new Array(this.bitsLength).fill(null);
        for (let p in this.properties) {
            d[this.bitsLength - this.properties[p].bitPosition - 1] = p;
        }
        return d.map((item, i) => `${i + 1}: ${item === null ? `` : `${JSON.stringify(item)}`}`).join(', ');
    }

}
