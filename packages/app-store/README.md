# @hedron-gl/app-store

Zustand-based application state store for Hedron. Separate from the engine store, which does most of the heavy lifting, this is focused on small state things which are app specific.

- Active sketch selection
- Node and input selections
- Parameter group states
- Sketches directory path
- Global dialog state
- Save file management
- Project persistence

## Usage

Most usage would actually be via `useAppStore` imported from `@hedron-gl/ui-core`
