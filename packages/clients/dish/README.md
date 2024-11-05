# POLAR client DISH

## Content

The DISH client differs from other POLAR clients in that it does not take any additional configuration, but is a closed product. All configuration is done dev-side and is versioned; updates require version updates.

The client can use two different configurations which are controlled by the parameter `MODE` in the index.html. `MODE="EXTERN"` will apply the configuration for the map client as a Website, and `MODE="INTERN"` for the map used in the internal DISH software. `MODE` is initially set and cannot be changed after hosting.

Please see the CHANGELOG.md for all changes after the initial release.

## Usage

The product is a hostable HTML page. Usually, we do not deliver full pages, but rather components. Due to this, it's just that component, but full page width and height.

Add a query parameter, e.g. `?ObjektID=1506`, to the page's URL to initially focus a feature and display its feature information by ObjektID.

Name and casing of "ObjektID" have been directly taken from the backend to avoid duplicate naming.
