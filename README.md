# hedron

## Get started

1. Run `pnpm install` at the top level to install all deps
2. Run `pnpm build` to build all packages in the monorepo
3. Run `pnpm dev` to start Hedron. This will only be watching for changes in `packages/desktop` - you'll need to separately run `dev` in packages you are working in

## Repo structure

This is a monorepo. All app-like parts are under `apps` and the packages they consume are under `packages`, most of which are published on npm.

## License overview

Most code in this repo is licenced under MIT, with one exception. The Hedron app itself is published under AGPL-3.0. This means you can freely use all of Hedron's packages to make your own software (e.g. web experiences) but you cannot use the main app itself (e.g the entire UI interface) in your own software without making that open-source, with the same AGPL-3.0 license.

## Working on isolated packages

If you're just working on the clock package, use `pnpm dev:clock`. This will build the clock package and also start the `clock-test-app` package.

## Using example project

If you're running this repo using `pnpm dev`, you can happily point Hedron to the example project and it will be fine. If you're sending the project elsewhere (e.g. for distribution as part of app version), the project needs to be built differently. This is because `pnpm` uses symlinks in `node_modules`.

Build and zip the example project with `pnpm build:example` and it will be created at `dist` in the root of this repo. This will also happen automatically with `pnpm dist`

## Configuration

You can configure the renderer type by creating a `.env` file in this directory:

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env`. You can set the renderer to `webgpu` for experimental testing of three's `WebGPURenderer`. Note: this breaks anything using the composer (e.g. post processing)

```bash
# Options: 'webgl' | 'webgpu'
HEDRON_RENDERER_TYPE=webgpu
```

The `.env` file is gitignored, so your local configuration won't be committed to the repository.

# Experimental Features

Access [Experimental Features](./EXPERIMENTAL_FEATURES.md) via the command line, these are features created during show prep, and are not yet complete in terms of funcationality/UI.
