import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import { createFilter } from '@rollup/pluginutils'

const external = createFilter(['ol/**'], null, { resolve: false })

export default {
  input: 'index.ts',
  output: [
    {
      file: 'dist/index.js',
      name: '@polar/lib-get-features',
      format: 'es',
      sourcemap: 'inline',
    },
  ],
  external,
  plugins: [typescript({ check: true }), commonjs(), resolve(), terser()],
}
