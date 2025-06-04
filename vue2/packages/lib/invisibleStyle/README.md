# invisibleStyle

Exports a style for vector layer features that results in invisibility. Plugins that work with feature visibility ought to use this package to keep them interoperable.

```js
import { InvisibleStyle, isInvisible, isVisible } from '@polar/lib-invisible-style'

// making feature invisible
feature.setStyle(InvisibleStyle)

// making feature visible
feature.setStyle(undefined)

// checking if a feature is (in)visible
isInvisible(feature) // true or false
isVisible(feature)
```
