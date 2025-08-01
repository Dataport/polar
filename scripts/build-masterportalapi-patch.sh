#!/bin/sh
find node_modules/@masterportal/masterportalapi/ -type f -name '*.js' -print0 | \
	xargs -0 sed -i 's|olcs/lib/olcs/\([a-zA-Z]\+\)\.js|olcs/\1|g'
