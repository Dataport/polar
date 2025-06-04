# tooltip

Minimal package that provides a `div` element factory bound to `i18next` translations. The element can e.g. be used in `ol/Overlay`.

```js
import { getTooltip } from '@polar/lib-tooltip'

const tooltip = getTooltip({
  style: '', // optional inline style string
  localeKeys: [
    // tag/content pairs
    ['h2', 'plugins.myPlugin.header'],
    ['p', 'plugins.myPlugin.body']
  ],
})

// tooltip contains 'element' (a div) and 'unregister' (when div is no longer used)
// the element will automatically update on locale change
```
