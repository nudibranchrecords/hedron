# hedron

## Get started

1. Run `yarn` at the top level to install all deps
2. Run `yarn dev` at the top level to start Hedron. This will watch for changes in both `@hedron/desktop` and `@hedron/engine`

## Building for all platforms

1. Close any instance of Hedron
2. Run `yarn dist`. This will go through all checks and builds, then create executables for windows, mac, linux

## Update Hedron version

Run `npx lerna version`. This bumps all versions across packages. While in alpha, we want to choose the "Custom Prerelease" option. This will keep the format of `1.0.0-alpha.x`, where only `x` gets bumped (as major/minor/patch makes no sense).
