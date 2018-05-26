


# Hedron

Perform live shows with your three.js creations.

![Hedron UI](http://nudibranchrecords.github.io/hedron/ui.gif)

## Features

- 📥Import [three.js](https://github.com/mrdoob/three.js/) sketches without having to recompile
- 🎊 Place multiple sketches in the same scene
- 🔊 Control variables using audio, MIDI and BPM based LFO
- 🕹️ Call functions using audio, MIDI and BPM based sequencer
- ⚡ Define macros to control multiple variables at once
- ⏲️ Use MIDI clock input or tap tempo to get BPM
- 🌇🎚️🌋 Create many scenes and crossfade between them
- 🔍 Preview and compose scenes before displaying them to the audience
- 🎛️ Use virtual MIDI banks to get the most out of your controllers
- 💡 Use MIDI Learn to quickly assign controls
- ⚙️ Support for multiple MIDI control modes (abs, rel1, rel2, rel3)
- 📽️ Easily send output picture to external display
- 💾 Save / load using JSON project files

## Getting Started

### Install
A compiled version is not currently available to download, so you'll need to download the source and compile yourself.

1. Make sure [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/en/docs/install) are installed on your machine.
2. Open terminal and run the commands below.
```bash
$ git clone https://github.com/nudibranchrecords/hedron.git
$ cd hedron
$ yarn
$ yarn start
```

`yarn start` opens the app in dev mode, you'll probably want to close the dev tools on the right hand side of the window.

Run `yarn dist` to package up the app for best performance and no dev tools. Once the build is complete, you'll find the app inside `/dist`.

### Load trippy example project

1. Choose "Load Existing Project". Locate the repo directory. Open `example-projects/trippy/project.json`
2. An alert will appear. Choose "Locate Sketch Folder" and open `/example-projects/trippy/sketches`
3. Play it some music, tap BPM, experiment with the controls
4. 😎

## User Guide
Head to the [User Guide](https://github.com/nudibranchrecords/hedron/wiki/Hedron-User-Guide) to learn how to use Hedron.


## Creating Sketches
Head to the [Creating Sketches Guide](https://github.com/nudibranchrecords/hedron/wiki/Creating-Sketches) to learn how to create sketches.

## Get in touch
Made something awesome in Hedron you'd like to share? Need help or have some cool ideas? Let's talk! Find Alex on Twitter: [@funtriangles](https://twitter.com/funtriangles), or email: [alex@funwithtriangles.net](mailto:https://twitter.com/funtriangles).

## Contributing to Hedron

If you are having fun with Hedron, we'd love you to help with development. See the repo [issues](https://github.com/nudibranchrecords/hedron/issues) for what needs doing. We're particularly looking for developers who know about:

 - React/Redux
 - three.js/WebGL
 - Javascript performance
 - Spout/Syphon/C++ ([related issue](https://github.com/nudibranchrecords/hedron/issues/21))
 - Audio analysis ([related issue](https://github.com/nudibranchrecords/hedron/issues/8))

### How to contribute

 - Fork a branch from dev
- Make changes
- Ensure tests are passing
- Make a pull request to dev

### Dev scripts
| script | description |
|--|--|
| `yarn start` | Run in dev mode |
| `yarn dist` | Package the app |
| `yarn dist:dev` | Run a production build without packaging. Behaves similarly to `yarn start` in that it will look for a default project and open Chrome DevTools automatically. However it will not do any sort of live refreshing. |
| `yarn lint` | Run linting |
| `yarn test` | Run pre deployment tests (including linting) |
| `yarn test:dev` | Run tests on file changes (does not include linting) |
