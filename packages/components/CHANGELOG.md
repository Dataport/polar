# CHANGELOG

## unpublished

- Feature: Add the possibility to update the icon of the button for closing the MoveHandle.
- Feature: Set the initial top value of the MoveHandle to 45% of the root elements height or the maximum possible height on opening.
- Fix: The top value was not properly reset leading to the initial top value having no effect if the MoveHandle is currently open.

## 2.0.0

- Breaking: MoveHandle can now only be rendered once which is done in `@polar/core`. Please refer to the documentation of `@polar/core` on how to use this component.
- Feature: MoveHandle now remembers the previous position and sets it to the next content, if it doesn't exceed the maximum height.

## 1.0.0

Initial release.
