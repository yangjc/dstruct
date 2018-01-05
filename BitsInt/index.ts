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

export declare interface Property {
    bitPosition: number;
    defaultValue: boolean;
}

export declare interface Properties {
    [propertyName: string]: Property;
}

export declare type Description<D> = {
    [P in keyof D]? : boolean;
};

export class BitsInt<D, P> {

    static    MAX_LENGTH    : number = MAX_BITS_LENGTH;

    private   bits          : number[];
    private   properties    : Properties;

    readonly  maxValue      : number;
    readonly  bitsLength    : number;
    readonly  defaultValue  : number = 0;
    readonly  defaultDesc   : Description<D> = {};

    constructor(bitsLength: number, properties: P & Properties) {

        if (!Number.isInteger(bitsLength) || bitsLength <= 0) {
            throw new TypeError(`bits length should be positive integer`);
        }
        if (bitsLength > MAX_BITS_LENGTH) {
            throw new RangeError(`bits length should not bigger than ${MAX_BITS_LENGTH}`);
        }

        this.bits = new Array(bitsLength);

        let b: number = 1;
        for (let i = 0; i < bitsLength; i++) {
            this.bits[i] = b;
            b = b << 1;
        }

        this.maxValue = bitsLength === MAX_BITS_LENGTH ? MAX_VALUE : b - 1;

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
            if (this.defaultDesc[<keyof D>property] = defaultValue) {
                this.defaultValue += this.bits[bitPosition];
            }

            ++count;
        }

        if (count > bitsLength) {
            throw new RangeError(`count of properties should not bigger than bits length`);
        }

        this.bitsLength = bitsLength;
        this.properties = properties;
    }

    public getValue(description: Description<D>, value: number = this.defaultValue): number {
        for (let property in description) {
            if (!this.properties.hasOwnProperty(property)) {
                throw new Error(`undefined property "${property}"`);
            }
            if (description[property]) {
                if (!this.defaultDesc[property]) {
                    value += this.bits[this.properties[property].bitPosition];
                }
            } else {
                if (this.defaultDesc[property]) {
                    value -= this.bits[this.properties[property].bitPosition];
                }
            }
        }
        return value;
    }

    public parseValue(value: number, target: Description<D> = {}): Description<D> {
        if (!Number.isInteger(value) || value < 0) {
            throw TypeError(`positive integer required`);
        }
        if (value > this.maxValue) {
            throw RangeError(`value too large`);
        }

        for (let property in this.properties) {
            let b: number = this.bits[this.properties[property].bitPosition];
            target[<keyof D>property] = (value & b) === b;
        }
        return target;
    }

    public getDesc(description: Description<D>,
                   target: Description<D> = Object.assign({}, this.defaultDesc))
    : Description<D> {
        for (let property in description) {
            if (!this.properties.hasOwnProperty(property)) {
                throw new Error(`undefined property "${property}"`);
            }
            target[property] = description[property];
        }
        return target;
    }

    public getDefaultDesc(): Description<D> {
        return Object.assign({}, this.defaultDesc);
    }

    public print(): string {
        let d: (null | string)[] = new Array(this.bitsLength).fill(null);
        for (let p in this.properties) {
            d[this.bitsLength - this.properties[p].bitPosition - 1] = p;
        }
        return d.map((item, i) => `${i + 1}: ${item === null ? `` : `${JSON.stringify(item)}`}`).join(', ');
    }

}
