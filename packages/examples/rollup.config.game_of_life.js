import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import multiInput from 'rollup-plugin-multi-input'

export default defineConfig({
    input : [
        'game_of_life.js'
    ],

    output : {
        dir     : 'dist_game_of_life',
        format  : 'esm',
        chunkFileNames  : 'chunks/[name]-[hash].js'
    },

    plugins : [
        resolve({ preferBuiltins : true }),
        commonjs(),
        multiInput(),
    ],

    external : [
        '@web/dev-server',
    ]
})
