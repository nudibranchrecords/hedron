import { EventEmitter } from 'events';
import ClockStore from '../stores/ClockStore';

import GeneratedClock from './GeneratedClock';

class Clock extends EventEmitter {

	constructor() {

		super();

		this.getInfo();

		ClockStore.on('change', this.getInfo);
		GeneratedClock.on('pulse', this.pulse.bind(this));

	}

	getInfo() {

		this.bpm = ClockStore.getBpm();
		this.mspp = (60/(this.bpm*96))*1000;

	}

	pulse() {

		let marker = window.performance.now();
		let pulses = 1;

		this.emit('pulse');

		// Pulse 3 more times (multiply by 4)
		const multiply = () => {

			// Check to see if time passed is more than time per pulse
			let diff = window.performance.now() - marker;

			while (diff > this.mspp) {
				// Pulse if havent reached 4
				if (pulses < 4) {
					this.emit('pulse');
				} 
				// Increase next time to check against by time per pulse
				marker+=this.mspp;
				// Loop over in case missed more than one pulse
				diff-=this.mspp;
				pulses++;
			}

			if (pulses < 4) {
				console.log(pulses);
				requestAnimationFrame( multiply ); 
			}

		}

		requestAnimationFrame( multiply ); 

	}

}

export default new Clock();