# Hedron

Perform live shows with your three.js creations.

![Hedron UI](http://nudibranchrecords.github.io/hedron/ui.gif)

## Features

📥Import [three.js](https://github.com/mrdoob/three.js/) sketches without having to recompile
🌇 Layer up multiple sketches in the same scene
🔊 Control variables using audio, MIDI and BPM based LFO
🕹️ Call functions using audio, MIDI and BPM based sequencer
⚡ Define macros to control multiple variables at once
⏲️ Use MIDI clock input or tap tempo to get BPM
🎛️ Use virtual MIDI banks to get the most out of your controller
💡 Use MIDI Learn to quickly assign controls
⚙️ Support for multiple MIDI control modes (abs, rel1, rel2, rel3)
📽️ Easily send output picture to external display
💾 Save / load using JSON project files

## Quick start

1. Make sure [Node.js](https://nodejs.org/en/) is installed on your machine.
2. Clone/download the repo and navigate to the root directory in terminal.
3. Run `yarn` to install dependencies.
4. Launch Hedron in dev mode with `yarn start`.

## dev.config.js

You can get extra functionality by adding `dev.config.js` to `/config`.

```javascript
// config/dev.config.js
module.exports = {
  defaultProject: false
}
```

Setting `defaultProject` to the path of a saved project (e.g. `/Users/alex/Desktop/foo.json`) can help improve your workflow when developing:
* The project will load automatically on load/restart
* The project sketches folder will be watched for changes, triggering a restart

## Scripts

Package the app with `yarn dist`.

To quickly run a production build without packaging, run `yarn dist:dev`. Behaves similarly to `yarn start` in that it will look for a default project and open Chrome DevTools automatically. However it will not do any sort of live refreshing.

Run tests with `yarn test:dev`.
