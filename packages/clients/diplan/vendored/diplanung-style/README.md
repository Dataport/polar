# DiPlanung Style

## Description

This repository contains design resources that can be used in DiPlanung projects.

## Installation

To install the node module:

`npm install --save diplanung-style`

After installation, a new folder diplanung-style is created in node_modules.

## Usage

There are multiple ways of using the package.

### CSS

Import the generated CSS file in your project:

```scss
@import "diplanung-style/dist/style.css";
```

The CSS version is already minified. It includes the Open Sans font and icons.

### SCSS

_**Main.scss**_

In case you want to use the whole package (similar to the CSS variant), you should import the main.scss.

```scss
@use "diplanung-style/src/scss/main";
```

_**SCSS-Modules:**_

In case you only want to use a single (or not the whole package) element or customize the module, you should import the respective SCSS module.

We recommend `@use` but you could also use `@import`.

```scss
@use "diplanung-style/src/scss/button";
```

- accessibility
- button
- button-group
- checkbox
- css-props
- heading
- icon (\*includes the icomoon.io icon font)
- input
- input-group
- label
- link
- normalize
- radio
- text
- textarea
- typography (\*includes the Open Sans font)

_**SCSS variables and mixins:**_

In case you just want to use a certain mixin or variable, you should use or import the associated variable/mixin SCSS file.

```scss
@use "diplanung-style/src/scss/mixins/clearfix" as *;

.element {
  @include clearfix;
}
```

```scss
@use "diplanung-style/src/scss/variables/button" as button-variables;

.element {
  padding: button-variables.$button-core-padding;
}
```

## Vite Integration

Before you can use the included fonts, you need to set `server.fs.strict` to `false`.

https://vitejs.dev/config/server-options.html#server-fs-allow

```js
export default defineConfig({
  server: {
    fs: {
      strict: false,
    },
  },
});
```

## Authors and acknowledgment

]init[ AG für digitale Kommunikation, Berlin

## License

MIT
