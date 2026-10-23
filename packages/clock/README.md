# Clock

Hedron Clock module. Exports a Hedron plugin (`ClockPlugin`) and the standalone `Clock` class.

## Plugin usage

```ts
const clockPlugin = new ClockPlugin()
engine.registerPlugin(clockPlugin) // Register before plugins that depend on the clock

engine.registerPlugin(new LFOInput({ clock: clockPlugin.clock }))
```

BPM is stored in the plugin's `globalClockBpm` option node (project state). BPM changes calculated by the clock (tempo tap, MIDI clock) are written to the node, which in turn updates the clock.

The plugin also has `togglePlay`, `reset` and `tapTempo` shot option nodes, so these actions can be triggered by inputs like any other shot.

UI: `ClockGlobalPanel` (global panel) and `GlobalClock` (widget).

## Standalone usage

`Clock` never applies BPM it calculates itself. `onBpmChange` is a change request, so apply it yourself:

```ts
const clock = new Clock()
clock.onBpmChange((bpm) => (clock.bpm = bpm))
clock.onSmoothedBpmChange((bpm) => console.log('Display BPM', bpm))
```

Check out `apps/clock-test-app` for a full example.

## Develop

`pnpm run dev:clock`

Get both the test app and the clock module building (and watching) with this command, run from **the repo root**, not this package directory.
