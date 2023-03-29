import * as Utils from './utils';
import * as Config from '../config';
import { join } from 'path';

let addLabel = {
    header: [],
    footer: []
};

/**
 * 获取 配置
 * @param {*} opts
 * @returns
 */
function getConfigure(opts) {
    const config = Object.assign({}, Config, opts);
    const routeFilePathRegList = Utils.getRouteFileMatchRegAll(config);

    return {
        config,
        routeFilePathRegList
    };
}

/**
 * 处理 App.vue文件
 * @param {string} source
 * @returns
 */
function handleAppVue(source) {
    Utils.print('App.vue file match, process: ', process.env.UNI_PLATFORM);

    const handleAppRes = Utils.handleAppTemplateAddCode(source);
    const labelList = Utils.handleGetTemplateRowCode(handleAppRes.addCode);
    const handleLabelList = Utils.handleGetTemplateHeaderOrFooterLabelCode(labelList);

    source = handleAppRes.source;
    source = source.replace(/<script>/, '<script>console.log(' + Utils.consoleStyle() + ')');
    addLabel = Object.assign(addLabel, handleLabelList);

    return source;
}

/**
 * 处理 路由文件
 * @param {*} source
 * @param {*} path
 * @returns
 */
function handleRouteFile(source, path) {
    Utils.print('route file match: ', path);

    source = Utils.addCodeToHeader(source, addLabel.header.join(''));
    source = Utils.addCodeToFooter(source, addLabel.footer.join(''));

    return source;
}

/**
 * webpack loader
 * @param {string} source
 * @returns
 */
export default function (source) {
    const { routeFilePathRegList, config } = getConfigure(this.query);

    // 匹配 App.vue
    if (this.resourcePath === join(process.env.UNI_INPUT_DIR, '/App.vue')) {
        source = handleAppVue(source);
    }

    // 匹配 路由文件
    if (routeFilePathRegList.some((reg) => reg.test(this.resourcePath))) {
        source = handleRouteFile(source, this.resourcePath);
    }

    // 是vue或nvue文件，切填写了vLabel配置
    if (
        Utils.isVueFile(this.resourcePath) &&
        Object.prototype.toString.call(config.vLabel) === '[object Object]'
    ) {
        source = Utils.handleVLabelReplacement(source, config.vLabel);
    }

    return source;
}

/**
 * vite plugin
 * @returns
 */
export function vitePlugin(opts) {
    const { routeFilePathRegList, config } = getConfigure(opts);

    return {
        name: Config.name,
        enforce: 'pre',

        // configureServer(server) {
        //     return () => {
        //         server.middlewares.use((req, res, next) => {
        //             // 自定义请求处理...
        //             console.log('hot configureServer');

        //             return next();
        //         });
        //     };
        // },

        // handleHotUpdate(ctx) {
        //     console.log('handleHotUpdate', ctx.modules);

        //     return ctx.modules;
        // },

        transform(source, path) {
            // 匹配 App.vue
            if (path === join(process.env.UNI_INPUT_DIR, '/App.vue')) {
                const env = process.env.UNI_PLATFORM;

                process.env.UNI_PLATFORM = 'vite';
                source = handleAppVue(source);
                process.env.UNI_PLATFORM = env;
            }

            // 匹配 路由文件
            if (routeFilePathRegList.some((reg) => reg.test(path))) {
                source = handleRouteFile(source, path);
            }

            // 是vue或nvue文件，切填写了vLabel配置
            if (
                Utils.isVueFile(path) &&
                Object.prototype.toString.call(config.vLabel) === '[object Object]'
            ) {
                source = Utils.handleVLabelReplacement(source, config.vLabel);
            }

            return { code: source };
        }
    };
}
