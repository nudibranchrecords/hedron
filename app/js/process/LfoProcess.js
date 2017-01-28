import SketchesStore from '../stores/SketchesStore';
import AudioBandsStore from '../stores/AudioBandsStore';
import AudioInputs from '../inputs/AudioInputs';

import * as SketchActions from '../actions/SketchActions';
import Clock from './Clock';

class AudioProcess {

	constructor() {

		this.sketches = SketchesStore.getAll();

		this.delta = 0;
		this.speed = Math.PI*2/Clock.ppqn;

		Clock.on('pulse', this.onClockPulse.bind(this));

	}

	onClockPulse() {

		this.delta += this.speed;

		const audioData = AudioInputs.getData();

		Object.keys(this.sketches).map((sketchId) => {

	    	const sketchInputs = this.sketches[sketchId].data.inputs;

	    	if (sketchInputs && sketchInputs.lfo) {

				for (const param of Object.keys(sketchInputs.lfo)) {

					const {multiply, waveShape} = sketchInputs.lfo[param];

					const y = this.getWaveValue(this.delta*multiply, waveShape);
					
					SketchActions.editSketchParam(sketchId, param, y);

				}

	    	}

	    });
		
	}

	getWaveValue(x, shape) {

		let y;

		switch (shape) {
	        case 'sine':
	          y = Math.sin(x);
	          break;
	        case 'sawTooth':
	          y = (x - Math.floor(x + 0.5)) * 2;
	          break;
	        case 'rSawTooth':
	          y = - (x - Math.floor(x + 0.5)) * 2;
	          break;
	        case 'square':
	          y = Math.sign(Math.sin(x));
	          break;
	        case 'triangle':
	          y = Math.abs((x - Math.floor(x + 0.5)) * 2);
	          break;
	    }

		return (y+1)/2; // convert from -1 ~ 1 to 0 ~ 1
	}

}

export default new AudioProcess();