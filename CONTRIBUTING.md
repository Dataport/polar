# Contributing

Thank you for your interest in contributing to POLAR! This document outlines the guidelines for reporting issues and contributing code.
Before proceeding, please mind our [code of conduct](https://github.com/Dataport/polar/blob/main/CODE_OF_CONDUCT.md).

## Reporting Issues

Should you find bugs, feel free to add them as [issues](https://github.com/Dataport/polar/issues). A bug template is provided.
You may also contact us via polar@dataport.de.

## Contributing Code

All contributions to the project, whether it being code or documentation, are more than welcome and should be added via a [pull request](https://help.github.com/articles/using-pull-requests).
Please make sure that the pull request follows the [guidelines](#pull-request-guidelines) below.

Please note that any contribution will be licensed under [EUPLv1.2](https://raw.githubusercontent.com/Dataport/polar/main/LICENSE) as per [GitHub's terms of service](https://help.github.com/articles/github-terms-of-service/#6-contributions-under-repository-license).

### Pull Request Guidelines

If not directly communicated with a maintainer of the project, please first [create an issue](https://github.com/Dataport/polar/issues/new) explaining what a related pull request is intended to change or fix.
This ensures that a similar effort is not already in development by another contributor.

If the issue is accepted, please create a pull request with the following guidelines in mind:

- The developer creating the pull request should assign the pull request to themselves and is considered the "assignee". The assignee should set the appropriate labels themselves, corrections may be made by maintainers.
- The [pull request conventions](https://github.com/Dataport/polar/wiki/Pull-Request-conventions) should be followed.
- All pipelines should pass. This includes
  - Linting (`npm run lint`)
  - Automated tests (unit, e2e) (`npm run test && npm run test:e2e`)
  - Type checks (`npm run tsc:ci`)
- The [architecture decision records](https://github.com/Dataport/polar/wiki/Architecture-Decision-Records-%F0%9F%93%83) have to be adhered to.
- The [pull request template](https://github.com/Dataport/polar/blob/main/.github/pull_request_template.md) includes a number of checks to be performed by the assignee. These will also be checked by a reviewing maintainer.
- The `package-lock.json` file should not be updated unless a package is added or updated. The lockfile contains some content that should not be changed; it should not be deleted and recreated by re-installation.
- All packages except those located in `packages/client` should be kept stable according to the principle of "Open for extension, closed for modification". Breaking changes must be discussed with the maintainers in advance. Developments in the clients themselves may be breaking, as long as agreed with the customer.
- It should be possible to merge the pull request automatically. This means that the pull request should be up to date with the target branch and no merge conflicts should exist.
- Before a merge is possible, a review by a maintainer accepting the pull request should be awaited.
