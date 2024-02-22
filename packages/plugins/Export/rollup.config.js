import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import scss from 'rollup-plugin-scss'
import terser from '@rollup/plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import vue from 'rollup-plugin-vue'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      name: '@polar/plugin-export',
      format: 'es',
      sourcemap: 'inline',
    },
  ],
  external: ['@repositoryname/vuex-generators', 'jspdf', 'vue', 'vuex'],
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
    terser(),
  ],
}
