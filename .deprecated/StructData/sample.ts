/**
 * YJC <yangjiecong@live.com> @2017-11-20
 */


'use strict';

import { initStructData, StructData, Data, StructFieldMap, MappedFields } from '@yjc/dstruct/StructData';

import { sample as sampleIE, Name as IESName } from '../IntEnum/sample';
import { sample as sampleBI, Desc as BISDesc } from '../BitsInt/sample';

interface SampleD<BI = BISDesc, IE = IESName> {
    id  : string;
    bi  : BI;
    ie  : IE;
}

type SampleV = SampleD<number, number>;

export declare type Desc = Data<SampleD>;
export declare type Value = Data<SampleV>;

export declare type Field = 'id_' | 'bi_' | 'ie_';
export declare type Fields = MappedFields<keyof SampleD, Field>;

@initStructData<SampleD, SampleV>({

    bi: {
        default: (): BISDesc => sampleBI.getDefaultDesc(),

        get: (data: BISDesc): BISDesc => data,

        set: (data: BISDesc, desc: BISDesc): BISDesc => sampleBI.getDesc(desc, data),

        getValue: (data: BISDesc): number => sampleBI.getValue(data),

        setValue: (data: BISDesc, value: number): BISDesc => sampleBI.parseValue(value, data),
    },

    ie: {
        default: (): IESName => sampleIE.names.head,

        get: (data: IESName): IESName => data,

        set: (data: IESName, name: IESName): IESName => name,

        getValue: (data: IESName): number => sampleIE.getValue(data),

        setValue: (data: IESName, value: number): IESName => sampleIE.getName(value),
    },
})
export class Sample extends StructData<SampleD, SampleV> {}

export const sampleMapped = new StructFieldMap<Field, SampleD, SampleV>({
    id: "id_",
    bi: "bi_",
    ie: "ie_",
}, '_', Sample);

module.parent === null && (function () {
    let x: Sample = new Sample({
        id: '#'
    });
    x.data.ie = 't-t';
    x.data.bi = {
        one: true
    };
    let b0: BISDesc = x.data.bi;
    console.log(x.data.bi);
    x.data.bi = {
        two: false
    };
    console.log(x.data.bi, x.data.bi === b0);
    console.log(x.data, x.getData(), x.getValue(), x.getValue().bi.toString(2));
    x.setValue({
        ie: 1
    });
    console.log(x.data.ie, x.getData());

    console.log(sampleMapped.queryData({
        'id_': '#id',
        'ie_': 0,
        'bi_': 255
    }).getData());
    console.log(sampleMapped.mapData(x));
})();
