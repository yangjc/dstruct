/**
 * YJC <yangjiecong@live.com> @2018-01-09
 */


'use strict';

import { DescData, Descriptor, StructData } from '@yjc/dstruct/StructData';

import { Sample as BI, sample as sampleBI } from '../BitsInt/Sample';

export interface D {
    itemId: number;
    itemValue: string;
    status: BI;
    null: null;
}

export type Sample = DescData<D>;

export const statusDescriptor: Descriptor<BI> = new Descriptor<BI>({
    getDefault: (): BI => sampleBI.getDefaultDesc(),
    getValue: (desc: BI): number => sampleBI.getValue(desc),
    parseValue: (value: number): BI => sampleBI.parseValue(value),
    getDesc: (desc: BI): BI => sampleBI.getDesc(desc),
});

export const itemValueDescriptor: Descriptor<string> = new Descriptor<string>();

export const structure: StructData<D> = new StructData<D>({
    itemId: 'item_id',
    itemValue: itemValueDescriptor.def('item_value'),
    status: statusDescriptor,
    null: null
});

module.parent === null && (function () {
    const d: Sample = {
        itemId: 2,
        status: {
            one: true,
            other: true
        }
    };
    console.log('fields', structure.fields);
    console.log('keys', structure.keys);
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
