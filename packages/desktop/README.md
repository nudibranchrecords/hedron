# Hedron Desktop

The desktop application for Hedron.

## Configuration

You can configure the renderer type by creating a `.env` file in this directory:

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` to set your preferred renderer:

```bash
# Options: 'webgl' | 'webgpu'
HEDRON_RENDERER_TYPE=webgpu
```

The `.env` file is gitignored, so your local configuration won't be committed to the repository.

## Development

```bash
npm run dev
```

## Building

```bash
npm run build
```
