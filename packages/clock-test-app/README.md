# Clock Test App

This is a test app for the Hedron Clock module. A good place to look for example usage of the clock module.

## Develop

`yarn run dev:clock`

Get both the test app and the clock module building (and watching) with this command, run from **the repo root**, not this package directory.

## Tips for testing with external clock

You can use Pro Tools to generate an external clock value. Using the Pro Tools project in this repo, you can even have the clock speed up and slow down to really put it through its paces! 😈

1. Download [Pro Tools Intro](https://www.avid.com/pro-tools/intro) (it's free and enough for testing needs)

   - ⚠️ **WARNING** ⚠️ If you are using a new Mac with Apple Silicon (e.g. M1), **run Pro Tools with Rosetta enabled**.
     It will appear to work fine without doing this, but you will likely have MIDI related issues causing the clock to do all sorts of weird stuff.

2. Make sure you have some way of routing internal MIDI. (e.g. "Audio MIDI Setup" on OSX)
3. Open `midi-clock-test.ptx`
4. Run `yarn run dev:clock` from the root of the repo
5. Follow the URL in the terminal to open up the test app (e.g. http://localhost:5173/)
6. In Pro Tools, press play (spacebar). It will start a metronome sound and a clock signal, that will speed up and slow down. You can visually see if it all seems in sync in the Clock Test App.
