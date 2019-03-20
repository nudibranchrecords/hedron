# Hedron User Guide

Here is a quick overview of how to use Hedron.

## Sketches
Sketches are created with [three.js](https://github.com/mrdoob/three.js/). They are a Javascript module that exports a single [THREE.Group](https://threejs.org/docs/#api/objects/Group), to be placed in the main scene. The different aspects of a sketch can be controlled using "params" and "shots".

Many sketches can be added to the same Hedron scene. These can be multiple instances of the same sketch, or different types of sketches.

In order to add sketches, click on the "+" in the right sidebar. If you're starting from scratch, you'll need to tell Hedron where your sketch folder is.

To remove a sketch, click the delete button at the bottom of the view for that sketch.

Use the dropdown menu on the Add Sketch scene to organise your sketches. If the author of the sketch has provided the correct meta data, you'll be able to organise based on category or author. Otherwise you can organise based on the folder structure of your sketches.

### Switching between sketches
You can switch between different sketches that are already added to Hedron using the right sidebar.

## Params
Params are the variables of a sketch. They default to a value between 0 and 1 (although more types of param are [planned](https://github.com/nudibranchrecords/hedron/issues/13)). The simplest way to control a param is to click and drag the value bar.

### Adding an input to a param
The real power of Hedron is the ability to link different inputs to a param. This can be audio, LFO or MIDI.

To add an input to a param:

 1. Open the param by clicking on the area below the value bar
 2. Choose an input using the "add new input" dropdown
 3. Click the "activate" button to enable.

You can add more inputs and choose between them using the tabs inside that param. You'll note that each type of input has its own extra controls. Each of these can also be assigned to a MIDI control by clicking on the icon next to the value bar.

The activate/disable button can also be assigned a MIDI control by clicking on the icon next to the button (must send a "note on" midi message).

Some things to note:

 - Adding a MIDI input will involve a "MIDI learn" step
 - MIDI inputs are always active, they do not have an active/disabled state
 
### Editing the range of a param
Params can have their range extended or decreased, this can be useful if you want to change the range for a particular instance of a sketch, but not affect all other instances of the sketch, or change the default range of the script

To edit the range of a param:

 1. Open the param by clicking on the area below the value bar
 2. Open the advanced options by clicking "Advanced"
 3. Edit the minimum/maximum fields, the fields update when you press Enter or the field loses focus

## Shots
Shots are functions that the sketch has exposed for the user to have fun with. These could be things such as explosions, pre scripted animations, etc. The simplest way to control a shot is to click on the hit area for that shot.

### Adding an input to a shot
Shots have a very similar system to adding inputs as params, so please refer to the section above. However, there are a few things to note:

 - When a shot has an audio input, the shot will display a value bar and a red "target line". If the value passes the target, the shot fires. It then needs to drop below this target to rearm. Adjusting the gain can give control over how often this fires
 - MIDI should be a "note on" type control
 - Instead of LFO, shots have a "sequencer". The rows of the sequencer are **one beat** (quarter note) split into 8. Click on each step for when you want the shot to fire.

## Reloading sketches / Auto reload
If you have the "Watch sketches" setting enabled, Hedron will automatically refresh your sketches. However, if you don't have this enabled or something went wrong with the file watch (e.g. your sketch imports a file outside of its own folder) you'll need to click "Reload File" to see changes made to sketch files.

This refresh will remove the sketch from the scene, import any new params or shots, remove and old params and shots, and then add the new sketch back into the scene.

**Please note: File change detection may not work with all text editors. (e.g. Atom on OSX is reported to be inconsistent).**

## Macros
Macros make it possible to control many params at once. To start using macros, click on "Macros" on the right sidebar.

### Adding a macro

 1. Click "add macro" and give it a name
 2. Click "start learning". Any changes to params you make will now be added to this macro.
 3. Change some param values in a sketch
 4. Click "stop learning"

### Macro gotchas

Currently, after creating a macro, it wont do much until you change the values of its target values. This is because when you are teaching the macro, you are moving the params to their target. You'll need to move these param values away from their target for the macro to work.

Improvements to macros are [planned](https://github.com/nudibranchrecords/hedron/issues/10).

## MIDI Devices
Midi devices display on the left hand side, underneath the preview.

## MIDI Clock
By default, MIDI clock is generated by Hedron.

- Use the "Tap Tempo" button to match the tempo of the song you are performing to.
- Use the "reset" button at the beginning of the beat/bar/phrase to keep things in sync.
- You can manually edit the generated clock BPM, or disable it completely in the settings. (Project > Settings)
- If you have an external MIDI clock connected, Hedron will detect it automatically. You should disable the generated clock if you are using an external one.

## Audio Parameters
By clicking on the audio level bars left of the clock controls you can edit parameters to change the shaping of the incoming audio. The controls affect the audio as follows.

- **Levels Falloff** - This is the amount that the value passed on to the parameters gets reduced by each frame, when this number is low the value will quickly jump up with a sound, but take time to come back down to zero.
- **Levels Smoothing** - This is how much the prior frames value will be blended with the current incoming audio value, adding smoothing will cause quick changes in volume, up or down, to change more slowly. When this number is at 0 there is no smoothing, and at 1 it will lock the current value of the audio levels.
- **Levels Power** - This value controls a power function with an exponent between .5 and 3. When this parameter is low it will cause low audio levels to get boosted higher when this parameter is high, low levels will be passed through even lower, causing only values that were high to begin with to remain high.
- **Normalize Levels** - This causes each frequency band to be normalized based on it's highest and lowest recorded values, this will help the parameters connected to audio move within their full range, as often the low end tends to be louder while the high end is quieter.
- **Normalized Range Falloff** - This is how much the recorded high and low of each frequency band decreases/increases respectively each frame.

## Other features

* Save or load using "Project > Save/Load/Save As..."
* Send to a connected display using "Displays > "Send to XXX"
