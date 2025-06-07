# Experimental Features in Hedron

This document lists and describes experimental features available in Hedron. These features can be accessed via the developer console (f12).

## Rendering

### Saving an image
`saveFrame()` - Save a timestamped image.

### Saving an image sequence
`renderFrames(count: number, name: string, ffmpeg?: boolean)` - Save a series of images.
Images will be saved to the Documents folder, in a folder named name. It will overwrite any existing files. Each frame will be suffixed with its index. If `ffmpeg` is true, it will try to create a video using ffmpeg (must be installed and made accessible via the command line by the user).  
ffmpeg command as follows:
`ffmpeg -y -framerate 30 -i "${dirPath}/${name}-%d.png" -c:v libx264 -pix_fmt yuv420p -crf 18 "${videoPath}"`

### Testing a video loop
`resetEvery(seconds: number, jumpTo?: number)` - Loop after a given time
`cancelReset()` - Stop the looping
`jumpTo` is used to test the 'loop point' of a video, it will jump to the end, play through to the loop + the opposite of the jump time.
ie; `resetEvery(6, 5)` will play from seconds 5-6, then 6-1, then back to 5.
The way the video loops work is by passing large/negative `deltaTime` values to the sketches. `deltaTime` is a new top-level property that was added to the object passed on sketch `update`
