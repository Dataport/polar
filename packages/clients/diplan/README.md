# POLAR client DiPlanKarten

## Contents

This client is a reusable map solution intended for DiPlanKarten as part of the [DiPlanung project](https://www.diplanung.de/). It contains a project-specific GFI template and default setup.

## Configuration

A detailed API description is provided in the contained `API.md` file. Usage examples are included in the `example` folder. It can be viewn by hosting the files in an arbitrary HTTP server. If you checked out the repository, a prior build is required. If you've got built package, the `prod-example.html` works as it is.

NPM users may e.g. run `npx http-server . -o ./example/prod-example.html`. When in a cloned repo, `npm run diplan:build && npm run diplan:build:serve` will wind up the current state in build mode, and `npm run diplan:dev` opens the client in development mode.
