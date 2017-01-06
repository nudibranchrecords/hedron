import { EventEmitter } from 'events';
import ClockStore from '../stores/ClockStore';
import * as ClockActions from '../actions/ClockActions';

import GeneratedClock from './GeneratedClock';

class Clock extends EventEmitter {

	constructor() {

		super();

		this.getInfo();

		this.beatPulses = 0;

		ClockStore.on('change', this.getInfo);
		GeneratedClock.on('pulse', this.pulse.bind(this));

	}

	getInfo() {

		this.bpm = ClockStore.getBpm();
		this.mspp = (60/(this.bpm*96))*1000;

	}

	pulse() {

		this.beatPulses ++;

		let marker = window.performance.now();
		let pulses = 1;

		const pulse = () => {
			this.emit('pulse');
			pulses++;
			this.beatPulses ++;

			if (this.beatPulses > 95) {
				ClockActions.addBeat();
				this.beatPulses = 0;
			}
		}

		// Pulse 3 more times (multiply by 4) to
		// get PPQN to 96 for smoother animations
		const multiply = () => {

			// Check to see if time passed is more than time per pulse
			let diff = window.performance.now() - marker;

			while (diff > this.mspp) {
				// Pulse if havent reached 4
				if (pulses < 4) {
					pulse();
				} 
				// Increase next time to check against by time per pulse
				marker+=this.mspp;
				// Loop over in case missed more than one pulse
				diff-=this.mspp;
				
			}

			if (pulses < 4) {
				requestAnimationFrame( multiply ); 
			}

		}

		pulse();
		requestAnimationFrame( multiply ); 

	}

}

export default new Clock();