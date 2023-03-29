import { provide, Ref } from 'vue';
import { provideKey } from '../../../config';

interface RefObj {
    [key: string]: () => Ref;
}

interface Opts {
    [key: string]: Ref;
}

export const pageProvide = (opts: Opts) => {
    const refObj: RefObj = {};

    Object.keys(opts).forEach((k) => {
        refObj[k] = () => opts[k].value;
    });

    provide(provideKey, refObj);
};
// export const pageProvide = (ref: Ref) => {
//     provide(provideKey, () => ref.value);
// };
