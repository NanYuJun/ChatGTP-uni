import { inject } from 'vue';
import { provideKey } from '../../../config';

type ComponentOpts = {
    [key: string]: { [key: string]: any };
}[];

type ComponentInjectRes<T> = {
    [K in keyof T]: () => T[K];
};

export const componentInject = <ComponentOpts>() => {
    return inject(provideKey) as ComponentInjectRes<ComponentOpts>;
};
