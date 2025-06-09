# hedron

## Get started

1. Run `yarn` at the top level to install all deps
2. Run `yarn dev` at the top level to start Hedron. This will watch for changes in both `@hedron/desktop` and `@hedron/engine`

## Working on isolated packages

If you're just working on the clock package, use `yarn dev:clock`. This will build the clock package and also start the `clock-test-app` package.

## Building for all platforms

1. Close any instance of Hedron
2. Run `yarn dist`. This will go through all checks and builds, then create executables for windows, mac, linux

## Update Hedron version

Run `npx lerna version`. This bumps all versions across packages. While in alpha, we want to choose the "Custom Prerelease" option. This will keep the format of `1.0.0-alpha.x`, where only `x` gets bumped (as major/minor/patch makes no sense).

# Experimental Features

Access [Experimental Features](./EXPERIMENTAL_FEATURES.md) via the command line, these are features created during show prep, and are not yet complete in terms of funcationality/UI.