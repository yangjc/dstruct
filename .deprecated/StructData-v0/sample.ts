/**
 * YJC <yangjiecong@live.com> @2017-10-25
 */

'use strict';

import {
    StructData,
    initStructData,
    StructDataTypes,
    StructFieldMap,
    FieldMapTypes
} from '.';

import {
    SampleTypes as BITypes,
    Sample as BISample
} from '../BitsInt/sample';

import {
    SampleTypes as IETypes,
    Sample as IESample
} from '../IntEnum/sample';

interface SampleS<BI = BISample, IE = IESample> {
    id  : string;
    bi  : BI;
    ie  : IE;
}

type SampleD = SampleS<BITypes.Desc, IETypes.Name>;
type SampleV = SampleS<number, number>;

export declare namespace SampleTypes {

    export type Desc = StructDataTypes.Data<SampleD>;
    export type Value = StructDataTypes.Data<SampleV>;

    export type Field = 'id_' | 'bi_' | 'ie_';
    export type Fields = FieldMapTypes.Fields<SampleS, Field>;

}

const filesMap = {
    id: "id_",
    bi: "bi_",
    ie: "ie_",
};
const tableName = '';


@initStructData<SampleS, SampleD, SampleV>({

    bi: {
        default: (): BISample => new BISample(),

        get: (data: BISample): BITypes.Desc => data.desc,

        set: (data: BISample, desc: BITypes.Desc): any => data.setDesc(desc),

        getValue: (data: BISample): number => data.getValue(),

        setValue: (data: BISample, value: number): any => data.setValue(value),
    },

    ie: {
        default: (): IESample => new IESample(),

        get: (data: IESample): IETypes.Name => data.name,

        set: (data: IESample, name: IETypes.Name): any => data.name = name,

        getValue: (data: IESample): number => data.getValue(),

        setValue: (data: IESample, value: number): any => data.set(value),
    },

}, filesMap, tableName)
export class Sample extends StructData<SampleS, SampleD, SampleV> {
    public data: SampleTypes.Desc;
    static queryData: (data: FieldMapTypes.MappedData<SampleTypes.Field>) => Sample;
    static mapData: (data: Sample) => FieldMapTypes.MappedData<SampleTypes.Field>;
    static fieldMap: StructFieldMap<SampleTypes.Field, SampleS, SampleV>;
}



module.parent === null && (function () {

    console.log(Sample.queryData({'id_': 'xx'}).getData());

    let s = new Sample();
    console.log(s.getValue());
    s.data.ie = 't-t';
    console.log(JSON.stringify(s.data));
    // s.data.id = '#';
    s.data.bi = null;
    s.data.bi.other = true;
    console.log(s.getData(), s.getValueOf('bi').toString(2));

    s.data.bi = {
        two: false,
    };
    console.log(s.getValueOf('bi').toString(2));

    let v = Sample.mapData(s);
    console.log(v.bi_);

    console.log(Sample.fieldMap.fields.bi);

})();
