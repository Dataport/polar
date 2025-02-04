# How does diplanung-style work?

The package cannot be used directly and is precompiled in dev and build steps. The script create a `dist/` folder with the values parsed to a readable format for usage in vuetify configurations. See `precompile` script in the `package.json`.

TODO reduce the weight of iconMap.ts by filtering to the actually used icons
