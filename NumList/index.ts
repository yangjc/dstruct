/**
 * YJC <yangjiecong@live.com> @2017-12-04
 */

'use strict';

export declare interface Property {
    position: number;
    defaultValue?: number;
}

export declare interface Properties {
    [propertyName: string]: Property;
}

export declare type Description<D> = {
    [P in keyof D]? : number;
};

export class NumList<D, P> {

    readonly valueLength: number;
    readonly maxPosition: number = 0;
    readonly base: number;
    readonly defaultDesc: Description<D> = {};
    readonly defaultValues: string[] = [];

    private properties: Properties;
    private positions: string[] = [];

    constructor(valueLength: number, properties: P & Properties, base: number = 36) {
        this.valueLength = valueLength;
        this.properties = properties;
        this.base = base;

        for (let p of Object.getOwnPropertyNames(properties)) {
            const { position, defaultValue } = properties[p];
            this.positions[position] = p;
            if (typeof defaultValue === 'number') {
                this.defaultDesc[<keyof D>p] = defaultValue;
                this.defaultValues[position] = defaultValue.toString(base);
            }
            if (position > this.maxPosition) {
                this.maxPosition = position;
            }
        }
    }

    public getValue(description: Description<D>): string {
        let values: string[] = Object.assign([], this.defaultValues);
        for (let p in description) {
            if (!this.properties.hasOwnProperty(p)) {
                throw new Error(`undefined property "${p}"`);
            }

            values[this.properties[p].position] = description[p].toString(this.base);
        }
        const r = values.join(',');
        if (r.length > this.valueLength) {
            throw new RangeError(`value.length out of range`);
        }
        return r;
    }

    public parseValue(value: string, target: Description<D> = {}): Description<D> {
        if (value.length > this.valueLength) {
            throw new RangeError(`value.length out of range`);
        }
        const values: string[] = value.split(',');
        for (let i = 0; i < this.maxPosition; i++) {
            if (!this.positions.hasOwnProperty(i)) {
                throw new Error(`undefined position "${i}"`);
            }
            const v = values[i];
            if (v) {
                target[<keyof D>this.positions[i]] = parseInt(v, this.base);
            } else {
                delete target[<keyof D>this.positions[i]];
            }
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

}
