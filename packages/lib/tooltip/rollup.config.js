import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'index.ts',
  output: [
    {
      file: 'dist/index.js',
      name: '@polar/lib-tooltip',
      format: 'es',
      sourcemap: 'inline',
    },
  ],
  external: ['i18next'],
  plugins: [typescript({ check: true }), commonjs(), resolve(), terser()],
}
