import Path from 'path';
import Fs from 'fs';
import ErrorId from './errorId';
import { parse } from 'node-html-parser';
import { name, version } from '../config';

// const reg = /^node-modules\/uview-ui\S+/

/**
 * 浏览器控制台输出信息
 * console.log
 */
export const consoleStyle = () => {
    return [
        `\`\n %c ${name} V${version} `.concat(`%c url: 965.ink/uniapp-router-view-loader \n\``),
        `'color: #ffffff; background: #64b587; padding:5px 0;'`,
        `'color: #fff;background: #38485c; padding:5px 0; margin-left:-1px;'`
    ];
};

/**
 * 获取 文件匹配正则（vue或nvue文件）
 * @param {string} publicPath
 * @param {string} path
 * @returns
 */
export const getFileMatchReg = function (publicPath, path) {
    const fullPath = Path.join(publicPath, `/${path}`);
    const regStr = JSON.stringify(`^${fullPath}.(n)?vue$`);
    const reg = new RegExp(regStr.substring(1, regStr.length - 1));
    // const reg = new RegExp(`^${fullPath}.(n)?vue$`)

    return reg;
};

/**
 * 是否是 vue 或 nvue文件
 * @param {string} path
 * @returns
 */
export const isVueFile = function (path) {
    return /.(n?)vue$/.test(path);
};

/**
 * 获取 所有已注册的路由文件的正则规则（vue或nvue文件）
 * @returns
 */
export const getRouteFileMatchRegAll = function (config) {
    try {
        const jsonStr = Fs.readFileSync(
            Path.join(process.env.UNI_INPUT_DIR, './pages.json'),
            'utf8'
        );
        // 移除注释
        const { pages, subPackages = [] } = JSON.parse(jsonStr.replace(/\/\/[ \S\t]+/g, ''));
        const list = [];

        pages.forEach(({ path }) => {
            list.push(getFileMatchReg(process.env.UNI_INPUT_DIR, path));
        });

        subPackages.forEach(({ pages, root }) => {
            pages.forEach(({ path }) => {
                list.push(getFileMatchReg(process.env.UNI_INPUT_DIR, root + '/' + path));
            });
        });

        return list;
    } catch (e) {
        console.log(e);
        print('error', ErrorId[10001]);
    }
};

/**
 * 添加代码到头部
 * @param {*} source
 * @param {*} code
 */
export const addCodeToHeader = function (source, code) {
    return source.replace(/<view(.*?)>/, (s) => s + code);
};

/**
 * 添加代码到尾部
 * @param {*} source
 * @param {*} code
 */
export const addCodeToFooter = function (source, code) {
    return source.replace(
        /(<\/view>)([\s]*)(<\/template>)(?!(([\s\S]*)(<\/template>)))/,
        (s) => code + s
    );
};

// /**
//  * 获取 App.vue 文件中 template 默认内容
//  * 先匹配标签再移除首位标签
//  * @param {*} source
//  * @returns
//  */
// function handle(source) {
//     return source.match(/(<template>).*?(<\/template>)/)[0].replace(/<(\/?)template>/g, '')
// }

/**
 * 获取 App.vue 文件中 template 默认内容
 * 先匹配标签再移除首位标签
 * @param {*} source
 * @returns
 */
export const handleAppTemplateAddCode = function (source) {
    // `App.vue`中我们添加的代码`tepmlate`代码
    let addCode = '';

    switch (process.env.UNI_PLATFORM) {
        case 'h5':
            // 获取App.vue中uniapp插入的代码和我们添加的代码
            const originTemplateCode = source
                .replace(/(?<=<\/template>)[\w\W]*<\/template>/, (s) => {
                    addCode = s;
                    return '';
                })
                .match(/<template>[\s\S]+<\/template>/)[0];

            // 移除我们添加的代码, 使代码还原
            source = source.replace(/<template>[\s\S]+<\/template>/, originTemplateCode);

            return {
                source,
                addCode
            };

        case 'mp-weixin':
        case 'mp-alipay':
        case 'mp-baidu':
        case 'mp-toutiao':
        case 'mp-kuaishou':
        case 'mp-lark':
        case 'mp-qq':
        case 'mp-360':
        case 'quickapp-webview':
        case 'app-plus':
        case 'vite':
            source = source.replace(/<template>[\s\S]+<\/template>/, (s) => {
                addCode = s;
                return '';
            });

            return {
                source,
                addCode
            };

        default:
            print('error', ErrorId[10201]);
    }
};

/**
 * 获取 template 代码中的每组闭合根标签
 * 先移除template标签再匹配
 * 例如：3组根闭合标签
 * ```
 * <text>123</text>
 * <view />
 * <view>
 *     <text>123</text>
 * </view>
 * ```
 * @param {*} source
 */
export const handleGetTemplateRowCode = function (source) {
    // 过滤template标签
    source = source.replace(/<(\/?)template>/g, '');

    // 过滤注释标签并解第一层级的所有标签
    const codeStrList = parse(source).querySelectorAll('> *').toString().split(',');

    // 过滤 \n和空格
    // return codeStrList.map(codeStr => codeStr.replace(/(\n?)\s+/g, ''));
    return codeStrList.map((codeStr) => codeStr.replace(/\n\s+/g, ''));

    // ===
    // const list = [];

    // // 过滤 注释标签
    // source = parse(source).toString();

    // // <Label />
    // source = source.replace(/<.*? \/>/g, s => {
    //     list.push(s);
    //     return '';
    // })

    // source.match(/(<.*? \/>)|(<.*?>([\w\s<>\/]+)<\/.*?>)/g)

    // return list;
};

/**
 * 获取 App.vue代码中实际添加到页面代码的头部或尾部标签
 * @param {*} labelList
 * @returns
 */
export const handleGetTemplateHeaderOrFooterLabelCode = function (labelList) {
    const viewRouterReg = /<view-router(\s{0,})><\/view-router>/;
    const header = [];
    const footer = [];

    let flag = false;
    let count = 0;

    labelList.forEach((label) => {
        if (viewRouterReg.test(label)) {
            flag = true;
            count++;
            return true;
        }

        if (flag) {
            footer.push(label);
        } else {
            header.push(label);
        }
    });

    // 标签异常
    if (count === 0) {
        print('error', ErrorId[10101]);
    } else if (count > 1) {
        print('error', ErrorId[10102]);
    }

    return {
        header,
        footer
    };
};

/**
 * 获取 显示ID
 * @returns
 */
export const getPrintID = function () {
    return `[${name}]:`;
};

/**
 * 打印日志
 * @param {'log'|'error'} type
 * @param {string} msg
 */
export const print = function (type = 'log', msg) {
    const ID = getPrintID();

    switch (type) {
        case 'log':
            console.log(`${ID}${msg}`);
            break;

        case 'error':
            throw new Error(`${ID}${msg}`);
    }
};

/**
 * 获取 ast 中静态和动态 class 内容
 * @param {*} ast
 * @returns
 */
// export const getClass = function (ast) {
//     const staticName = ast.attrsMap['class'];
//     const dynamicName = ast.attrsMap[':class'];

//     return {
//         hasStatic: staticName !== undefined,
//         hasDynamic: dynamicName !== undefined,
//         staticName,
//         dynamicName
//     }
// }

/**
 * 处理 class 拼接
 * @param {string} source
 * @param {Object} ast
 * @param {Object} ast.attrsMap
 * @param {string} ast.attrsMap.class
 * @returns
 */
// export const handleClassJoin = function (source, ast) {
//     const classCode = getClass(ast)
//     // const static = / class=('|").*?('|")/;
//     const static = /\sclass=('|").*?('|")/;
//     const hasStaticReg = /^<\w+(.*?)(([\s\S]*?)class=('|").*?('|"))/;
//     // const dynamic = / :class="('?).*?('?)"/
//     const dynamic = /\s:class="('?).*?('?)"/
//     const hasDynamicReg = /^<\w+(.*?)(([\s\S]*?):class="('?).*?('?)")/

//     let res = source

//     // 静态 class
//     // class='name' 或 :class="'name'"
//     if (classCode.hasStatic && hasStaticReg.test(source) !== null) {
//         const className = classCode.staticName + ' ' + Config.WX_THEME_CLASS_KEY;

//         console.log('===== className =======')
//         console.log(className)
//         console.log('===== className =======')

//         res = source.replace(static, ` class="${className}"`)

//         console.log('======== handle source =========')
//         console.log(res)
//         console.log('======== handle source =========')
//     }

//     // 动态 class
//     // :class="nameList" 或 :class="nameList + ' name'" 或 :class="[nameList, 'name']"
//     else if (classCode.hasDynamic && hasDynamicReg.test(source) !== null) {
//         const className = classCode.dynamicName.replace(/\[|\]/g, '') + `, '${Config.WX_THEME_CLASS_KEY}'`;

//         res = source.replace(dynamic, ` :class="[${className}]"`)
//     }

//     // AST 匹配失败
//     else {
//         return `<view style="color:red;">${JSON.stringify(ast.attrsMap)}</view>`;
//     }

//     return res;
// }

// /**
//  * 替换 VNode 虚拟标签，例："<VNode-Navbar />"
//  * @param {string} source
//  */
// export const handleVNodeReplace = function (source) {
//     Object.keys(Config.VNode).forEach((name) => {
//         const reg = new RegExp(`<${name}(\\s{0,})\/>`);

//         if (reg.test(source)) {
//             const template = Fs.readFileSync(
//                 Path.join(__dirname, '../', Config.VNode[name])
//             ).toString();

//             source = source.replace(reg, template);
//         }
//     });

//     return source;
// };

/**
 * 虚拟标签，例："<div />" => "<view />"
 * @param {string} source
 */
export const handleVLabelReplacement = function (source, vLabel = {}) {
    for (const [key, val] of Object.entries(vLabel)) {
        // "<u-text>xxx</u-text>"
        const reg1 = new RegExp(`<(\/?)${key}(\\s*)>`, 'g');
        // "<u-text />"
        const reg2 = new RegExp(`<${key}(.*?)\/>`, 'g');

        const labelReplaceReg = new RegExp(key, 'g');

        source = source.replace(reg1, (s) => s.replace(labelReplaceReg, val));
        source = source.replace(reg2, (s) => s.replace(labelReplaceReg, val));
    }

    return source;
};
