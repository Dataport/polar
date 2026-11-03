# Arcane knowledge 🧙🔮

Ideally, this file would be empty. However, there's some manual procedures not yet automated, and knowledge that's difficult to put as comment since comments will probably not be found in the situations that require reading them.

For these cases, this not-so-secret file denotes our not-anymore-arcane knowledge.

## Release process

With `X` being the respective version:

1. `npm version X -m "chore(release): version X"`
2. `git push`
3. `git push origin vX`

## Update process

* Updating the `@masterportal/masterportalapi` requires a full test and API check in all using locations. The package does not follow SemVer, and thus it is up to us to make sure all endpoints fit appropriately.
* `ol` may implicitly be updated on updating `@masterportal/masterportalapi`. Use the search function to find all code positions with comments containing "undocumented". These code positions refer to `ol` functionality that is not documented and may change without a breaking version.

## Documentation tags

Some TypeDoc tags control two independent things: documentation visibility through `targetAudience` and presence in the emitted declaration files.

* `@internal` - docs: `core` only; declaration files: removed.
* `@hidden` / `@ignore` - docs: removed for every audience; declaration files: kept.
* `@alpha` - docs: `core` and `plugin`, hidden for `client`; declaration files: removed. Marks an export as not-yet-stable (relevant e.g. to plugin authors).
* `@docHidden` (project-specific) - docs: `core` only, hidden for `plugin` and `client`; declaration files: kept. Used to keep types in published declaration files without including them in the documentation.
