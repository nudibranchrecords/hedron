# `@hedron-gl/ui-core`

A collection of components and hooks used by Hedron desktop as well as any related plugins/inputs.

## Usage

This package is used by `@hedron-gl/desktop`. In order for hot module reloading to work, we have a special build setup in the vite config. We're using aliases to grab the components and CSS from source (see the vite config at `@hedron-gl/desktop`).

If for some reason we want to just import this package normally, one extra CSS file needs to be imported into the project, `@hedron-gl/ui-core/modules.css` which is the bundled CSS for all CSS modules across all components. When pulling the components directly from source, these CSS files come along for the ride so we don't need to import this bundled CSS file.

## FilePicker

`FilePicker` defaults to dialog mode, selecting from `availableFiles` with
`currentFileName` and `onFileNameChange`. Dialog mode accepts an optional `accept`
array of MIME types or file extensions. Use `mode="local"` to select an absolute
directory path using the host's path picker.

Both modes show an X button when a file is selected, allowing it to be cleared
without opening the picker. Clearing calls `onFileNameChange(null)`.
Cancelling the local picker leaves the selection unchanged.

### Local path parameters

File node configs can set `fileSource` to `'resource'` (the default)
or `'local-directory'`:

```ts
{
  nodeType: 'param',
  key: 'outputDirAbsolute',
  title: 'Output Directory',
  valueType: 'file',
  fileSource: 'local-directory',
  defaultValue: null,
}
```

Resource values are resource names, resolved to resource URLs by the engine's
`getParamValue`. Local values are absolute path strings returned unchanged by
`getParamValue`; they are not looked up in resources or marked as missing resources.
The source is stored with the node and saved with the project.

Hosts supply a `LocalPathPickerProvider` around their node controls. Its `value`
is an async function receiving `{ fileSource, currentPath }` and returning
an absolute path, or `null` on cancellation. Failures should reject; the picker
logs and displays the error without changing the value. Hedron desktop supplies
this through Electron's directory dialog.

The standard file node control automatically uses `FilePicker`'s `mode="local"`
for local sources, with the same controlled `currentFileName` /
`onFileNameChange` API and X-to-clear behavior as dialog mode. Selection is
disabled with an explanatory tooltip when the host has no path picker provider.
