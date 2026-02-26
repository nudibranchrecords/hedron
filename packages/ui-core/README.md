# `@hedron-gl/ui-core`

A collection of components and hooks used by Hedron desktop as well as any related plugins/inputs.

## Usage

This package is used by `@hedron-gl/desktop`. In order for hot module reloading to work, we have a special build setup in the vite config. We're using aliases to grab the components and CSS from source (see the vite config at `@hedron-gl/desktop`).

If for some reason we want to just import this package normally, one extra CSS file needs to be imported into the project, `@hedron-gl/ui-core/modules.css` which is the bundled CSS for all CSS modules across all components. When pulling the components directly from source, these CSS files come along for the ride so we don't need to import this bundled CSS file.
