/* eslint-env node */

module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
  env: {
    /*
     * babel needed for jesting: Node does not support import/export;
     * .babelrc does not work here since it does not affect node_modules/ol (babel.config.js does)
     */
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs'],
    },
  },
}
