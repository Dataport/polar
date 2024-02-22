import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import svg from 'rollup-plugin-svg'
import terser from '@rollup/plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import { createFilter } from '@rollup/pluginutils'

const external = createFilter(
  [
    '@polar/lib-passes-boundary-check',
    '@repositoryname/vuex-generators',
    'ol/**',
  ],
  null,
  { resolve: false }
)

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      name: '@polar/plugin-pins',
      format: 'es',
      sourcemap: 'inline',
    },
  ],
  external,
  plugins: [
    // Types are not checked as typechecking does not work for vue-files with the current version, might be fixable with an upgrade of vue and vuex; see https://github.com/vuejs/vuex/pull/1121.
    typescript({ check: false }),
    commonjs(),
    resolve(),
    svg(),
    terser(),
  ],
}
