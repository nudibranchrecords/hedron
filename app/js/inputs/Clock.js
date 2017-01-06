import { EventEmitter } from 'events';
import ClockStore from '../stores/ClockStore';
import * as ClockActions from '../actions/ClockActions';
import MidiInputs from './MidiInputs';
import GeneratedClock from './GeneratedClock';

class Clock extends EventEmitter {

	constructor() {

		super();

		this.getInfo();

		this.beatPulses = 0;

		this.delta = 0;
		this.speed = Math.PI/96;

		ClockStore.on('change', this.getInfo);
		//GeneratedClock.on('pulse', this.pulse.bind(this));

		MidiInputs.on('clockPulse', this.pulse.bind(this));

	}

	getInfo() {

		this.bpm = ClockStore.getBpm();
		this.mspp = (60/(this.bpm*96))*1000;

	}

	getDelta() {
		return this.delta;
	}

	pulse() {


		let pulses = 1;
		let marker = window.performance.now();

		this.delta += this.speed;
		this.beatPulses ++;

		if (this.beatPulses > 24) {
			ClockActions.addBeat();
			this.beatPulses = 0;
		}

	

		// Pulse 3 more times (multiply by 4) to
		// get PPQN to 96 for smoother animations
		const multiply = () => {

			// Check to see if time passed is more than time per pulse
			let diff = window.performance.now() - marker;

			while (diff > this.mspp) {
				// Pulse if havent reached 4
				if (pulses < 4) {
					this.delta += this.speed;
					pulses++;
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

	
		requestAnimationFrame( multiply ); 

	}

}

export default new Clock();