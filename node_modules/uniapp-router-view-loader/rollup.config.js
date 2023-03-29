import json from '@rollup/plugin-json'
import { uglify } from 'rollup-plugin-uglify'
import typescript from 'rollup-plugin-typescript2';

const plugins = [json()]

// 生产环节开启压缩
if (process.env.NODE_ENV === 'production') {
    plugins.push(uglify())
}

export default [
    {
        plugins,
        input: './src/plugins/index.js', //入口文件
        output: {
            file: './dist/plugins/index.js', //打包后的存放文件
            format: 'cjs', //输出格式 amd es6 iife umd cjs
            name: 'bundleName' //如果iife,umd需要指定一个全局变量
        }
    },
    {
        plugins: [
            json(),
            uglify()
        ],
        input: './src/project/vue2/index.js', //入口文件
        output: {
            file: './dist/project/vue2/index.js', //打包后的存放文件
            format: 'esm', //输出格式 amd es6 iife umd cjs
            name: 'bundleName' //如果iife,umd需要指定一个全局变量
        },
    },
    {
        plugins: [
            json(),
            uglify(),
            typescript({
                tsconfigOverride: {
                    compilerOptions: { declaration: true }, // 生成.d.ts的文件
                    // exclude: ["tests/**/*.ts", "tests/**/*.tsx"]
                    include: ['src/**/*.ts']
                }
            }),
        ],
        external: ['vue'],
        input: './src/project/vue3/index.ts', //入口文件
        output: {
            file: './dist/project/vue3/index.js', //打包后的存放文件
            format: 'esm', //输出格式 amd es6 iife umd cjs
            name: 'bundleName' //如果iife,umd需要指定一个全局变量
        },
    },
]
