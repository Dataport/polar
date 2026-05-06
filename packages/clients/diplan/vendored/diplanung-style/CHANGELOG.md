# Changelog

## 13.2.0 (2025-04-02)


### Features

* **25658:** Add `$enable-host` sass config ([95fe80b](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/95fe80b1f03a795951f834a3b9c62d94477a79b1)), closes [#25658](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/25658)
* Add darker variant for link and button link ([5e408f6](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/5e408f6dd3d8c31bc39150da872300318f5edfaf)), closes [#24606](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/24606)
* **DpsFormSelect:** Add multiple slots based on vue-multiselect ([244a8e5](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/244a8e539505066ed78e1985f955c8667b430ced)), closes [#25713](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/25713)


### Bug Fixes

* **DpsFormSelect:** Disabled and readonly state without arrow ([d9ce29d](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/d9ce29d8c2ecef220a99d08462fca27f7388f777)), closes [#24494](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/24494)
* Update git repository in package.json ([9a812c3](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/9a812c3a034eed3efc4eb3ead5543aca86d31eee))

## 13.1.3 (2025-03-31)


### Bug Fixes

* **DpsButton:** Fix link-darker inline padding ([07feae4](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/07feae40e3e9c43a6fdcbbfebaf6536085afaad0)), closes [#24606](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/24606)

## 13.1.2 (2025-03-31)


### Features

* **Icons:** Add icon `feedback-info` ([64e3b77](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/64e3b77907e8e9a819dd4af78be59c346f5ff57e)), closes [#23529](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/23529)


### Bug Fixes

* **Datepicker:** Solve height of the Datepicker calculation ([968a692](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/968a6925c9c03c9d1b682a7fc78454572b24c074)), closes [#24516](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/24516)

## 13.1.1 (2025-02-17)


### Bug Fixes

* **FormFile:** Allow re-selection of same file ([d5814ea](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/d5814ea82cc0ddc933a7fe9edfa93d5c45ba8948))

## 13.1.0 (2025-02-07)


### Features

* **LoadingSpinner:** Add loading spinner component ([b8daf25](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/b8daf25432912ff56e448b81508698e7f919c486))

## 13.0.0 (2025-01-22)


### ⚠ BREAKING CHANGES

* The `id` property of DpsTableRow has been renamed to `collapseId`.

### Features

* Add collapsible function to DpsListGroupItem ([c196774](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/c196774239ea722c3d68d77c69abfe9663c6bbae)), closes [#22757](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/22757)
* **Icons:** Add three new icons ([7173842](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/7173842302c4bbf83f6f178c9072d0a8949accaf)), closes [#22424](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/22424)

## 12.0.0 (2025-01-14)


### ⚠ BREAKING CHANGES

* **FormDatepicker:** blacklisted dates in DpsFormDatePicker are no longer disabled but only grayed out

- added new format for blacklists which allows setting a range and title
* **FormFile:** Remove _input-group.scss

- fix DpsActionMenu button getting stretched vertically
- DpsInputGroup: hide divs with no slot content

### Features

* **FormFile:** Add DpsFormFile & DpsUploadFormGroup ([6ce0678](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/6ce06788464e38bf9802eb19c9db3f2d60c9dae7)), closes [#8311](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/8311) [#21490](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/21490)


### Bug Fixes

* **FormDatepicker:** Add new blacklist date format and make blacklisted dates clickable ([2a80410](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/2a80410c48cd67830dbb898a972a982ef26908b9)), closes [#22284](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/22284) [#22557](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/22557)

## 11.1.0 (2025-01-14)


### Features

* Add table component ([4ca4af7](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/4ca4af7f8ecb42a5854e0469fb2f4a5be5e91867)), closes [#8316](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/8316)

## 11.0.0 (2025-01-13)


### ⚠ BREAKING CHANGES

* **DpsAlert:** DpsAlert default variant has been changed from "info" to undefined

### Features

* **DpsAlert:** Add default variant to DpsAlert ([9702d67](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/9702d673f4f8d3c9b8433b97ca6df7c859bf69bd)), closes [#20886](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/20886) [#22405](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/22405)
* Improve DateRangePicker accessibility ([5e4723b](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/5e4723b52db407101b5b3d211e0b6c37b7be75fc))

## 10.0.7 (2025-01-07)


### Features

* **ListGroup:** Add list group and list group item ([0304fd8](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/0304fd8b11876acee8637257eb540c607e0a5b87)), closes [#8321](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/8321)


### Bug Fixes

* Fix bootstrap imports ([85519af](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/85519af6f9bc1120665456209d5a78d6194829dc))
* Fix collapsible component (revert changes) ([18cd8ce](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/18cd8ce561f331c0e85a3bf10c1fa16351e3e88e))

## 10.0.5 (2025-01-07)


### Bug Fixes

* Fix bootstrap imports ([b6866d4](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/b6866d4d2e260df06042705628966ca1d042ff2e))

## 10.0.4 (2025-01-06)


### Bug Fixes

* Fix bootstrap imports ([afd5dad](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/afd5dade2550eb9b2d139d45daf7b0d4f15d7bd2))

## 10.0.3 (2025-01-06)


### Bug Fixes

* Fix bootstrap imports ([b8837da](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/b8837da0dd1688f94e85069f132f5fd0612ebb85))

## 10.0.2 (2025-01-06)


### Bug Fixes

* Fix @popperjs/core import ([704886c](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/704886c2678df7e62cec25bc0595c8cc6968c717))

## 10.0.1 (2025-01-06)


### Bug Fixes

* Fix bootstrap imports ([8d70953](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/8d70953f3db8a93122de5a10d437a1de7f50cb84))

## 10.0.0 (2025-01-06)


### ⚠ BREAKING CHANGES

* - The `pattern` property of `DpsFormInput` no longer accepts `RegExp`.
- The `modelValue` of `DpsFormSelect` now accepts various new types.
- Styles of generic anchor/link elements have been removed.

- DpsFormSelect: Add title prop; id property not required anymore
- DpsLink: Add event object to $emit function, Fix target
- DpsSortSelect: Add title prop
- DpsActionMenu: id property not required anymore
- DpsFilterButton: Fix disabled state styles
- DpsFormCheckbox: Add readonly and error props
- DpsFormRadio: Add readonly and error props
- DpsCollapsible: Refactor Bootstrap implementation
- Button: Fix styles
- Link: don't apply styles to Dps components
- Improve Vue docs
- Add typescript
- Update unit tests
- Update create-component script
- Add missing stories to documentation

### Bug Fixes

* Fix minor issues ([2aca2df](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/2aca2df741700075518be7f9dd68184d2649fea0))
* **Icons:** Add download Icon ([be06679](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/be066792adfbac424f21f36ca1d785290e06eb5d)), closes [#21959](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/21959)

## 9.0.0 (2024-12-02)


### ⚠ BREAKING CHANGES

* **Forms:** The HTML tags for both components have been changed from `div` and `label` to `fieldset` and `legend`.

- Added `id` prop
- Updated HTML tags
- Modified and updated related tests

### Features

* **Forms:** Refactor DpsFormCheckboxGroup and DpsFormRadioGroup ([d13ab0b](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/d13ab0b31ea3cc233681301869113d04c4790a33))
* **Icons:** Add new export and import icons ([f828845](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/f828845c5b224c638fdde0630becfaa86821faf7)), closes [#15901](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/15901)

## 8.1.0 (2024-11-15)


### Features

* Add CSS props ([304beeb](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/304beebc381cde7ef546a76d7a919fc8406699d4)), closes [#20269](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/20269) [#20998](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/20998)

## 8.0.0 (2024-11-08)


### ⚠ BREAKING CHANGES

* **FormDatepicker:** The initialDate prop now requires string instead of a
object

### Bug Fixes

* **FormDatepicker:** Update Range on handle close ([977bcc8](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/977bcc819a4f1381b9275f789bd9bc4efb3769e5)), closes [#8298](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/8298)

## 7.0.0 (2024-10-29)


### ⚠ BREAKING CHANGES

* **Collapsible:** The component now only processes its own events.
Events from an embedded Bootstrap collapsible are no longer processed.
*  - Textarea: Rename CSS classes
 - Boolean props: Change default values from undefined to false

 CHANGES:
 - Add select controls for props
 - fix title for select components
 - fix formToggle disabled cursor

### Features

* **Forms:** Add FormDatepicker ([16151a4](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/16151a4cc9a581661c1e132809a14abe08918b68)), closes [#8298](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/8298)


### Bug Fixes

* **Collapsible:** Add check for event target ([6b45b02](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/6b45b0231f9d1358fa9fe08db02b4a28f9161179)), closes [#18996](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/18996) [#20944](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/20944)


### Documentation

* Update documentation and fix minor bugs ([b7186cb](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/b7186cb581bc2ef8a75eaaf1e83593614e0efcaa)), closes [#18092](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/18092) [#19961](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/19961)

## 6.1.0 (2024-10-10)


### Features

* **Button:** Add loading prop ([24d5e2b](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/24d5e2bebffea6a012c60c61c04402276466f208))


### Bug Fixes

* Fix SCSS import ([87be634](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/87be634730a5ef4948b65edc4a14abe3df970706))

## 6.0.0 (2024-10-04)


### ⚠ BREAKING CHANGES

* **Heading:** We now use CSS classes to style headlines.
The HTML elements for headline (h1 to h6) do not style the elements anymore.
Use 'dps-heading' class with 'dps-heading-1' to 'dps-heading-6'.

### Features

* **Heading:** Separate heading styling from semantics ([38a40b6](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/38a40b694047be847518a5830a1b48c6faf95670)), closes [#16004](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/16004)

## 5.6.1 (2024-10-02)


### Bug Fixes

* **LogoutAlert:** Fix SCSS imports ([44a0c3a](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/44a0c3a640d3c37d21e280b600d52a463ce19f2b))

## 5.6.0 (2024-10-02)


### Features

* **LogoutAlert:** Add logout alert component ([83d2ab8](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/83d2ab85fccd6a1d66642cbf89ab9245f94dd6ed)), closes [#18632](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/18632)

## 5.5.0 (2024-09-13)


### Features

* **FormToggle:** Add form toggle element ([d62ae2c](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/d62ae2c20a30ec494b3d3f2ffcea7cbc62ec384c)), closes [#8300](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/8300)


### Bug Fixes

* **Grid:** Import only bootstrap variables to grid stylesheet ([3fd6757](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/3fd6757c891755be2dbf8fd4b96988bf849e5aa8)), closes [#16998](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/16998)

## 5.4.0 (2024-09-04)


### Features

* **Icons:** Add comment-add icon ([2159154](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/215915454278e0317bcf707043372a0db5b15ee5))

## 5.3.1 (2024-09-03)


### Bug Fixes

* **Pagination:** Fix export ([3ce3294](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/3ce32949bbc7dddb45d22559071ac5a8dd5df560)), closes [#8318](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/8318)

## 5.3.0 (2024-09-03)


### Features

* **Pagination:** Add Pagination ([863b4fe](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/863b4fe7f02b687958b007d6e819423ce7e0d68e)), closes [#8318](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/8318)

## 5.2.0 (2024-09-02)


### Features

* **ActionMenu:** Add documentation for action menu ([4d5bc41](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/4d5bc4111b813cae41e62ecb758a37dda2e86ee8)), closes [#18112](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/18112)
* Add fluid grid extension ([b5f0248](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/b5f0248ce947e7589b629cb9a7301e0ff9389948))
* Make prop id optional for DpsActionMenu & DpsFormSelect ([144bce6](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/144bce6425d527d1c8aac1f5f63bc00e60d542e6))


### Bug Fixes

* Fix Badge warning text color ([b841c57](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/b841c57718c8d5d48de2b17767db8e9962726ac0)), closes [#16448](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/16448)

## 5.1.0 (2024-08-08)


### Features

* **Icons:** Add map icons ([b8e5c3c](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/b8e5c3c2ec9d7c95fa79e18d589d5fc3d8d2e0c2))

## 5.0.0 (2024-07-04)


### ⚠ BREAKING CHANGES

* We now use newer versions of Vue (3.4.27) and Bootstrap (5.3.3).

- Reconfigure Husky hooks
- Reconfigure Storybook
- Fix action menu disabled styles
- Fix form select outline (filter variant)
- Add lint-staged
- Reconfigure ESLint (flat configuration)
- Reconfigure StyleLint
- Refactor npm scripts
- Remove obsolete dependencies

### Miscellaneous Chores

* Update dependencies ([bd22563](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/bd22563bc759ceeabde38a21294f6409db511be5)), closes [#14844](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/14844)

## 4.3.0 (2024-07-02)


### Features

* **Icon:** Add dok_validieren icon ([9142229](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/9142229c7c389ed2914a670382c2bb469d1273b7))

## 4.2.0 (2024-06-28)


### Features

* **Icon:** Add wechseln icon ([4dd5e2c](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/4dd5e2ccbda94def16d2635d2380d7822e981a91))

## 4.1.0 (2024-06-19)


### Features

* **Alert:** Add optional prop to hide icon ([08a1fe9](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/08a1fe9a739e99dd082733ee0d9d021cf894562d))

## 4.0.0 (2024-05-28)


### ⚠ BREAKING CHANGES

* **Button:** Variables and mixin of button have changed.

- Mixin:
  - Remove font-weight from size "sm"
  - Add font-weight to size "lg"
  - Fix padding when no-padding and variant "link" and size "sm"
- Variables:
  - Reduce $button-font-weight from 600 to 500
  - Remove $button--size-sm--font-weight
  - Add $button--size-lg--font-weight

### Bug Fixes

* **Button:** Fix button styles ([882bb89](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/882bb897ace7e6df677e6517af9524c2769f55d6)), closes [#16253](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/16253)

## 3.1.0 (2024-05-27)


### Features

* **Icons:** Add not-available icon ([1718592](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/17185920542326e94cc5fb16adc0c0e65da41404))

## 3.0.0 (2024-05-13)


### ⚠ BREAKING CHANGES

* **Collapsible:** The rendered template has changed, if locked property is set.

If locked is true:
- Bootstrap collapsible functionality will be loaded
- the header content differs from the former implementation
* **Colors:** SCSS and CSS color variables have changed.

Removed:
- dps-color-secondary-button-drop-shadow
- dps-color-secondary-button-border
- dps-color-button-drop-shadow

Added:
- dps-color-primary-tint
- dps-color-primary-shade
- dps-color-primary-light
- dps-color-plan
- dps-color-delay

Deprecated:
- dps-color-dark -> use: dps-color-primary-shade
- dps-color-light-blue -> use: dps-color-primary-light

### Features

* **Colors:** Update color variables ([a855770](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/a8557708f86d7b4ea5b0bdce64f011d71e59a177)), closes [#16253](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/16253)


### Code Refactoring

* **Collapsible:** Refactor collapsible component ([0eda1ae](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/0eda1aec3845b3e971a301d09017e679cdefc580)), closes [#15035](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/15035)

## 2.11.0 (2024-05-06)


### Features

* **Forms:** Update radio and checkbox sizes ([7d599f5](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/7d599f561ef6133a8c59aabbb0c77c12202c5577)), closes [#13375](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/13375)
* **Icons:** Add "search-filter" icon ([615163f](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/615163f30203bdbcf1fc2d28b561991b28afe87e))

## 2.10.1 (2024-04-25)


### Bug Fixes

* Change styles of H5 and H6 headings according to Figma Designmaster ([c8f6190](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/c8f6190579ccfd43333092b9fd7f4176e06c7e9b)), closes [#14728](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/14728)

## 2.10.0 (2024-04-15)


### Features

* Add InputGroup Component ([543ea75](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/543ea751861172cab7c72bc61e75cf91acb0e2b0)), closes [#8313](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/8313)


### Bug Fixes

* **DpsFormSelect:** Add hover styles for filter select ([67a5a1b](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/67a5a1b997e14537aca26cb0a865ad29073bc03a)), closes [#13068](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/13068)
* **FileInput:** Change icon size to 24px ([a92d89f](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/a92d89f38e1afd45a1605048207f557842fe6263)), closes [#13070](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/13070)

## 2.9.0 (2024-03-21)


### Features

* Change of the grey tones ([1bb88b5](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/1bb88b5f8a53c084af1f864dec2f52f8523427f7)), closes [#14182](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/14182)

## 2.8.2 (2024-03-14)


### Bug Fixes

* DpsFormInput error when modelValue is undefined ([36450bf](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/36450bf33a8afb6d017b794ebe80bd4b0969247c))

## 2.8.1 (2024-03-14)


### Bug Fixes

* Replace browser specific search input cancel button with custom button ([9c0b51b](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/9c0b51bc23e943e89b46238a6173aa4d71c36a05)), closes [#13071](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/13071)

## 2.8.0 (2024-02-23)


### Features

* Add alert component ([46244e3](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/46244e31152260f0e10c7928e8d76379b7104031)), closes [#13375](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/13375)

## 2.7.0 (2024-02-22)


### Features

* Add new icons ([f00d534](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/f00d534bb36ac572419c09bcfc9379ef4239ba69))
* Update SortSelect ([8d348d1](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/8d348d17303954fecc09079430c60bb1f1233763)), closes [#12306](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/12306)

## 2.6.1 (2024-02-22)

## 2.6.0 (2024-02-21)


### Features

* Extend Collapsible and FormSelect ([a2b83fd](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/a2b83fd4ca9d4913cd1ba6773d91c78490ff7278)), closes [#12306](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/12306)

## 2.5.2 (2024-02-09)


### Bug Fixes

* Fix Bootstrap imports ([af57005](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/af57005acb298b18834fb34ea2278c59a1d25473))

## 2.5.1 (2024-02-09)

## 2.5.0 (2024-02-08)


### Features

* Add vue components ([3c9c828](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/3c9c828f016fa7207a0d826e6fc9fc38f8d4eb98)), closes [#11220](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/11220)

## 2.4.0 (2024-01-12)


### Features

* **Icons:** Update dokumente icon ([d311f22](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/d311f22a6c87957f9edcd0f5bc9b5554b6fae080))

## 2.3.0 (2024-01-12)


### Features

* **Icons:** Add dokumente icon ([90457df](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/90457df0dc9300f53a95436b0cf85a89edd44c4c))

## 2.2.0 (2023-11-30)


### Features

* **Icons:** Add veroeffentlichung-zueruckziehen icon ([12c19d8](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/12c19d89572b485887fa1de46fa8a4f6b9e3f638))

## 2.1.0 (2023-11-23)


### Features

* Add floppy-disk, plus-border and polygon icons ([44b7c56](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/44b7c568c62eaaf09a8f33e153ec6672822e5006))
* **Colors:** Update success colors ([9fa7376](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/9fa7376a2ba8c0b8b8dac32d50dbebc859a6a9c6))

## 2.0.1 (2023-11-06)


### Bug Fixes

* **Icons:** Fix icon scales ([3c6e558](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/3c6e558ce4d09b6b6be3d96d97fd4a251b864988))

## 2.0.0 (2023-11-02)


### ⚠ BREAKING CHANGES

* **Button:** CSS classes, mixins and variables of the button element have changed.
- Added CSS classes:
  - .dps-button--size-sm
  - .dps-button--squared
  - .dps-button--no-padding
- Renamed CSS classes:
  - .dps-button--tertiary -> .dps-button--link
  - .dps-button--large -> .dps-button--size-lg
- Removed CSS classes:
  - .dps-button__text
  - .dps-button--primary -> it's the new default style
  . .dps-button--icon
  - .dps-button--medium -> it's the new default style
  - .dps-button--rounded -> it's the new default style
  - .dps-button--invisible
  - .dps-button--action-item -> can be achieved with no-padding

### Code Refactoring

* **Button:** Refactor button element ([0f5ab37](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/0f5ab37d6fd19dbd02dda59892e757b135eacd94))

## 1.1.1 (2023-10-24)


### Features

* Add badge component ([3796ea7](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/3796ea7d675409a10ef64e4a75a3ffb216e189c0)), closes [#9086](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/9086)


### Bug Fixes

* **Badge:** Refactor badge element ([cf46036](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/cf46036962a55c2d514175e054079f4e7b3f6239))

## 1.0.0 (2023-10-18)


### ⚠ BREAKING CHANGES

* **Forms:** CSS classes, mixins and variables of form elements have changed.
- Checkbox: dps-input dps-input--checkbox -> dps-checkbox
- Radio: dps-input dps-input--radio -> dps-radio
- Input: removed type modifier classes, simplified success and error classes
- Textarea: refactored mixin

### Code Refactoring

* **Forms:** Refactor form elements ([381799c](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/381799ce65a30bb320e857430d2bb51e95e13b4b))

## 0.17.3 (2023-10-05)

## 0.17.2 (2023-09-29)


### Bug Fixes

* **Input:** Fix checkbox and radio styles ([bd6aa7c](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/bd6aa7c05bd313927ed3fb9ef64f6488d689cf7c)), closes [#8284](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/8284)

## 0.17.1 (2023-09-29)


### Bug Fixes

* **Link:** Remove obsolete styles ([f219281](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/f2192818d3a7a437f9493bd325659c7a315edecb)), closes [#8281](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/8281)

## 0.17.0 (2023-08-28)


### Features

* Add link element and adjust link colors ([fcb7c5e](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/fcb7c5e7175de387f83c5baecbd87864c693cc58))

## 0.16.1 (2023-08-15)


### Bug Fixes

* **Colors:** Change primary hover color ([eddc226](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/eddc2265d41a7684be959da5df05ce3fc0c396e0)), closes [#7409](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/7409)

## 0.16.0 (2023-08-11)


### Features

* Add meine-filter and refresh icons ([f323267](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/f323267fe4b766f1d1f74fcb2d54035f2fc2ed6f))

## 0.15.1 (2023-08-07)


### Bug Fixes

* Fix button styles ([72db405](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/72db405b9a2846cbdd920fb0b16bd4a4d4a14d40))

## 0.15.0 (2023-07-24)


### Features

* Add dok_ablehnen and dok_annehmen icons ([d1e8847](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/d1e8847c700f87cd0a74cec7b395b9b19cf86496))
* Add dok_ablehnen and dok_annehmen icons to scss ([a977f43](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/a977f4398f02de4b30ace380e3a4f4661b76ca4e))

## 0.14.2 (2023-07-21)


### Bug Fixes

* Fix button styles ([3cea9ca](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/3cea9cae8d7d37ee299d8f0e8e7aefb04e7c7a41)), closes [#6656](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/6656)

## 0.14.1 (2023-06-23)

## 0.14.0 (2023-06-23)


### Features

* Add telephone icon ([44e4d5b](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/44e4d5b697e635a4594a49da95dc5aa0f2972977)), closes [#5970](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/5970)

## 0.13.0 (2023-06-22)


### Features

* Add lock-error icon and update button border-radius ([5c5b700](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/5c5b7001401104af914f4b5643c2668197227461)), closes [#5970](https://www.dev.diplanung.de/DefaultCollection/DiPlanStyle/_git/diplan-style/issues/5970)

## 0.12.0 (2023-06-02)


### Features

* Add design updates - button text + icon gap ([2da6824](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/2da68242178fea8e4210ca40b0b971c894e8c187))

## 0.11.0 (2023-05-31)


### Features

* Add design updates ([bdb3779](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/bdb37790f66be08828f5f829038775040211e0e6))

## 0.10.0 (2023-05-30)


### Features

* **Background color:** Add new background color for e.g. loading indicator ([0916925](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/09169258a1a166ee5a4dfa24a197a05b72a8d7d7))

## 0.9.0 (2023-05-24)


### Features

* **5018:** Add design updates ([c5dbb59](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/c5dbb596d45fec8b1386fd7c11d5b67a84f6d3a5))

## 0.8.0 (2023-05-16)


### Features

* Add new icons "inhalt, datei-aktualisieren, datei-aktualisieren2, profil, layer-select" ([ce3a9fa](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/ce3a9faa65be262b4f3504654d9a7443a1bfa6f8))

## 0.7.0 (2023-05-10)


### Features

* Add new icons "vector" and "group" ([abd166d](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/abd166dcd8457b4183ba331a1de8e40d6e12e0cf))
* Add new icons "vector" and "group" ([b4d8ab8](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/b4d8ab8f62b69831a48be7c9ab7cfc41aa2ca849))
* add new simple language icon to the icon font ([627751a](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/627751a097c4718e6fa8b8fdce046eb2464cd202))
* add new sort icon ([3c91611](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/3c91611fec85f99fe7e885080ffc8f179c452c37))


### Bug Fixes

* **Colors:** Add new colors for filter input fields ([7ab19fd](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/7ab19fdf0a7273888951bf3568b6004c5c4f6c75))
* **Colors:** Add new colors for filter input fields ([32e50c4](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/32e50c4b7975d05221890222d0ac9768ce69dfe2))

## 0.5.1 (2023-04-12)


### Bug Fixes

* **Icons:** Correct order and naming of upload and export icons ([3ad4cb1](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/3ad4cb1df87535f5baee59e0014371dbf8f6e34f))
* **Input-Text:** Prevent color change of input icon after filter input fields got validated ([9d0563a](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/9d0563a0c31a80d5a3b9a5503bb633e5e118243f))

## 0.5.0 (2023-03-31)


### Features

* Add new icons. Update action item styles. Update label styles. Update input styles ([53d84ee](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/53d84ee3a59938313f2b26c01c0f0c4f9f7aad22))
* **File-Input:** Add new file chooser variant ([6a597c4](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/6a597c4ce6ebbd41cd4b11d5cf5bb438783cff85))

## 0.4.1 (2023-03-28)


### Bug Fixes

* Update heading styles according to screen design ([781021b](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/781021b8f25d9500b784911e38af80c94260ff1b))


### Reverts

* Reset changelog due to compilation errors ([80a4986](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/80a4986835297d783ac79d21b9eccc3e1a2d2187))

## 0.4.0 (2023-03-15)


### Features

* Add list element styles and documentation ([8564d83](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/8564d830bc946df16bd0e089a44bb98e49d67369))

## 0.3.0 (2023-03-06)


### Features

* Add new action item button. Add new primary color with opacity ([35acaa8](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/35acaa8308f0fc79114e9ef669eb4bd4909ace0b))

## 0.2.0 (2023-02-24)


### Features

* add header icons ([792de4b](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/792de4bb62df2c3e03a2e34b37b5a44bdf836a30))
* add new slim version of file upload ([a5eb7f7](https://www.dev.diplanung.de/DefaultCollection/EfA%20DiPlanung/_git/diplanung-style/commit/a5eb7f7eea9006421abc2ff429902ae4f6a5a4d8))
