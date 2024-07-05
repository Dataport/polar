# CHANGELOG

## unpublished

- Feature: Use newly added store parameter `deviceIsHorizontal` in place of computed value `isHorizontal`.

## 2.1.1

- Fix: The GFI's new flag `userInteraction` on the close interaction is now filled and forwarded according to whether the close call was due to the user intentionally closing the GFI rather than opening a new GFI. This is required for a fix in the GFI plugin.

## 2.1.0

- Feature: Add the possibility to update the icon of the button for closing the MoveHandle.
- Feature: Set the initial top value of the MoveHandle to 45% of the root elements height or the maximum possible height on opening.
- Fix: The top value was not properly reset leading to the initial top value having no effect if the MoveHandle is currently open.

## 2.0.0

- Breaking: MoveHandle can now only be rendered once which is done in `@polar/core`. Please refer to the documentation of `@polar/core` on how to use this component.
- Feature: MoveHandle now remembers the previous position and sets it to the next content, if it doesn't exceed the maximum height.

## 1.0.0

Initial release.
