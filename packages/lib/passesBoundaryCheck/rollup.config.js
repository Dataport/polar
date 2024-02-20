import terser from '@rollup/plugin-terser'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'index.ts',
  output: [
    {
      file: 'dist/index.js',
      name: '@polar/lib-passes-boundary-check',
      format: 'es',
      sourcemap: 'inline',
    },
  ],
  plugins: [typescript({ check: true }), terser()],
}
