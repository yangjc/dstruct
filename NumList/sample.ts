/**
 * YJC <yangjiecong@live.com> @2017-11-20
 */


'use strict';

import { NumList, Description, Property } from '@yjc/dstruct/NumList';

interface SampleD<T = boolean> {
    a: T;
    b: T;
    orz: T;
}

export declare type Sample = Description<SampleD>;

export const sample = new NumList<SampleD, SampleD<Property>>(80, {
    a: {position: 0, defaultValue: 11, },
    b: {position: 1, defaultValue: 22, },
    orz: {position: 5, },
});

module.parent === null && (function () {
    let d0: Sample = {
        orz: 233,
    };
    console.log(sample.maxPosition, sample.valueLength, sample.defaultDesc);
    console.log(sample.defaultValues, sample.defaultValues.map(v => parseInt(v, sample.base)));
    console.log(sample.getValue(d0));
    console.log(sample.getValue(sample.getDesc({b: 996})));
})();
