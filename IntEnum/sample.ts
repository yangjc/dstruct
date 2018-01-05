/**
 * YJC <yangjiecong@live.com> @2017-11-20
 */


'use strict';

import { IntEnum } from '@yjc/dstruct/IntEnum';

class Names {
    readonly head: 'head' = 'head';
    readonly body: 'body' = 'body';
    readonly 't-t': 't-t' = 't-t';
}

export declare type Name = keyof Names;

export const sample = new IntEnum<Name>(10, new Names(), {
    'head': 0,
    'body': 1,
    't-t': 2,
});

module.parent === null && (function () {
    let n: Name = 't-t';
    console.log(n, sample.getValue(n), sample.getName(1));
    console.log(sample.names.head, sample.values.head);
})();
