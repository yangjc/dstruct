/**
 * YJC <yangjiecong@live.com> @2017-10-22
 */


'use strict';

import { initBitsInt, BitsInt, BitsIntTypes } from '.';

interface SampleD<T = boolean> {
    one: T;
    two: T;
    other: T;
}

export declare namespace SampleTypes {

    export type Desc = BitsIntTypes.Description<SampleD>;

}

@initBitsInt<SampleD, SampleD<BitsIntTypes.Property>> (8, {
    one: {bitPosition: 0, defaultValue: false, },
    two: {bitPosition: 1, defaultValue: true, },
    other: {bitPosition: 5, defaultValue: false, },
})
export class Sample extends BitsInt<SampleD> {}

module.parent === null && (function () {
    let sample = new Sample();
    console.log(sample.desc, sample.desc.other, sample.print());
    sample.desc.other = true;
    console.log(sample.getValue().toString(2));
    console.log(sample.setDesc({one: true}).toString(2));

    let ss: SampleTypes.Desc = {
        one: false,
    };
})();
