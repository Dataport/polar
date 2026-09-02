/** @type {import('stylelint').Config} */

export default {
  plugins: ["stylelint-prettier", "stylelint-scss", "stylelint-selector-bem-pattern"],
  extends: [
    "stylelint-config-prettier-scss",
    "stylelint-config-standard-scss",
    "stylelint-config-standard-vue/scss",
  ],
  rules: {
    "at-rule-empty-line-before": [
      "always",
      {
        except: ["blockless-after-same-name-blockless", "first-nested"],
      },
    ],
    "custom-property-pattern": null,
    "no-descending-specificity": null,
    "property-no-unknown": [
      true,
      {
        ignoreSelectors: [":export"],
      },
    ],
    "selector-class-pattern": null,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["export"],
      },
    ],
    // Prettier
    "prettier/prettier": [true, { endOfLine: "auto" }],
    // SCSS
    "scss/dollar-variable-pattern": "^-?[a-z][a-z0-9]*(--?[a-z0-9]+)*$",
    // Selector BEM pattern
    "plugin/selector-bem-pattern": {
      preset: "bem",
    },
  },
};
