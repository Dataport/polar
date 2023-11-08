# POLAR client DISH

## Content

The DISH client differs from other POLAR clients in that it does not take any additional configuration, but is a closed product. All configuration is done dev-side and is versioned; updates require version updates.

Please see the CHANGELOG.md for all changes after the initial release.

## Usage

The product is a hostable HTML page. Usually, we do not deliver full pages, but rather components. Due to this, it's just that component, but full page width and height.

Add a query parameter, e.g. `?ObjektID=1506`, to the page's URL to initially focus a feature and display its feature information by ObjektID.

Name and casing of "ObjektID" have been directly taken from the backend to avoid duplicate naming.

In production mode, it is required to add the property `data-polar` to the `link` attribute importing the polar styles.
