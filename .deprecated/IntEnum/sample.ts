/**
 * YJC <yangjiecong@live.com> @2017-10-24
 */

'use strict';

import { initIntEnum, IntEnum, IntEnumTypes } from '.';

class Names {
    readonly head: 'head' = 'head';
    readonly body: 'body' = 'body';
    readonly 't-t': 't-t' = 't-t';
}

export declare namespace SampleTypes {

    export type Name = keyof Names;

}

export const sampleNames: IntEnumTypes.EnumNames<SampleTypes.Name> = new Names();
export const sampleValues: IntEnumTypes.EnumValues<SampleTypes.Name> = {
    'head': 0,
    'body': 1,
    't-t': 2,
};

@initIntEnum<SampleTypes.Name> (10, sampleValues, sampleNames)
export class Sample extends IntEnum<SampleTypes.Name> {}

module.parent === null && (function () {
    let sample = new Sample(sampleNames.head);
    console.log(sample.name, sample.getValue(), sample.max);
    sample.name = 'body';
    console.log(sample.getValue(), sample.getName(2), sample.get('head'));
    console.log(JSON.stringify(sample.names), JSON.stringify(sample.values));
})();
