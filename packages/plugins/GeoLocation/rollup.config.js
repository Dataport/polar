import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import scss from 'rollup-plugin-scss'
import svg from 'rollup-plugin-svg'
import terser from '@rollup/plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import vue from 'rollup-plugin-vue'
import { createFilter } from '@rollup/pluginutils'

const external = createFilter(
  ['@polar/**', '@repositoryname/vuex-generators', 'ol/**', 'vue', 'vuex'],
  null,
  { resolve: false }
)

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      name: '@polar/plugin-geo-location',
      format: 'es',
      sourcemap: 'inline',
    },
  ],
  external,
  plugins: [
    vue({
      defaultLang: { script: 'ts', style: 'scss' },
      css: false,
    }),
    scss({ fileName: 'index.css', sourceMap: true }),
    // Types are not checked as typechecking does not work for vue-files with the current version, might be fixable with an upgrade of vue and vuex; see https://github.com/vuejs/vuex/pull/1121.
    typescript({ check: false }),
    commonjs(),
    resolve(),
    svg(),
    terser(),
  ],
}
