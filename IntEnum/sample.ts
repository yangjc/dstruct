/**
 * YJC <yangjiecong@live.com> @2017-11-20
 */


'use strict';

import { IntEnum } from '@yjc/dstruct/IntEnum';

export declare type Sample = 'head' | 'body' | 't-t';

export const sample = new IntEnum<Sample>(10, {
    'head': 0,
    'body': 1,
    't-t': 2,
});

module.parent === null && (function () {
    let n: Sample = 't-t';
    console.log(n, sample.getValue(n), sample.getName(1));
    console.log(sample.names.head, sample.values.head);
})();
