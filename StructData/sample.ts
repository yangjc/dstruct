/**
 * YJC <yangjiecong@live.com> @2018-01-09
 */

'use strict';

import { DescData, Descriptor, StructData, getDescriptor } from '@yjc/dstruct/StructData';

import { Sample as BI, sample as sampleBI } from '../BitsInt/Sample';

export interface D {
    itemId: number;
    status: BI;
}

export type Sample = DescData<D>;

export const statusDescriptor: Descriptor<BI> = {
    getDefault: (): BI => sampleBI.getDefaultDesc(),
    getValue: (desc: BI): number => sampleBI.getValue(desc),
    parseValue: (value: number): BI => sampleBI.parseValue(value),
    getDesc: (desc: BI): BI => sampleBI.getDesc(desc),
};

export const structure: StructData<D> = new StructData<D>({
    itemId: getDescriptor('item_id'),
    status: getDescriptor('status', statusDescriptor)
});

module.parent === null && (function () {
    const d: Sample = {
        itemId: 2,
        status: {
            one: true,
            other: true
        }
    };
    console.log('default status', structure.defaults.status);
    console.log('input', d);
    console.log('input desc', structure.getDescData(d));
    console.log('output desc', structure.queryData({
        item_id: d.itemId,
        status: statusDescriptor.getValue(d.status)
    }));
    console.log('output value', structure.mapData(d));
    console.log('status value', structure.valueGetters.status(d.status));
})();
