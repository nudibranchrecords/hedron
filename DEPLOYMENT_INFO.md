# Maintaner doc - deployment

This file contains notes on how to version and deploy the app. Not relevant for anyone other than core maintainers.

## Building for all platforms

1. Close any instance of Hedron
2. Run `pnpm dist`. This will go through all checks and builds, then create executables for windows, mac, linux

## Update Hedron version

Run `pnpm lerna version`. This bumps all versions across packages. While in alpha, we want to choose the "Custom Prerelease" option. This will keep the format of `1.0.0-alpha.x`, where only `x` gets bumped (as major/minor/patch makes no sense).

## Publish packages

Run `pnpm lerna publish from-package --no-private`. Need to be logged in with `npm login`. Might need to update the authToken with `npm config set //registry.npmjs.org/:_authToken=YOUR_TOKEN_HERE`.
