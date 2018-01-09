/**
 * YJC <yangjiecong@live.com> @2017-11-20
 */


'use strict';

import { BitsInt, Description, Property } from '@yjc/dstruct/BitsInt';

interface SampleD<T = boolean> {
    one: T;
    two: T;
    other: T;
}

export declare type Sample = Description<SampleD>;

export const sample = new BitsInt<SampleD, SampleD<Property>>(8, {
    one: {bitPosition: 0, defaultValue: false, },
    two: {bitPosition: 1, defaultValue: true, },
    other: {bitPosition: 5, defaultValue: true, },
});

module.parent === null && (function () {
    let d0: Sample = {
        two: false,
        other: true,
    };
    let v0 = sample.getValue(d0);
    let v1 = parseInt('11', 2);
    console.log(sample.maxValue, sample.bitsLength, sample.defaultValue.toString(2), sample.defaultDesc);
    console.log(d0, sample.getDesc(d0), v0.toString(2), sample.parseValue(v0));
    console.log(v1.toString(2), sample.parseValue(v1));
})();
