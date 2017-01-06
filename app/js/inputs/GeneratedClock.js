import { EventEmitter } from 'events';
import ClockStore from '../stores/ClockStore';

class GeneratedClock extends EventEmitter {

	constructor() {

		super();

		this.marker = window.performance.now(); 

		ClockStore.on('change', this.getInfo);
		this.getInfo();

	}

	getInfo() {

		this.bpm = ClockStore.getBpm();
		this.mspp = (60/(this.bpm*24))*1000;

	}

	update() {
			
		// Check to see if time passed is more than time per pulse
		let diff = window.performance.now() - this.marker;

		while (diff > this.mspp) {
			// Pulse if so
			this.emit('pulse');
			// Increase next time to check against by time per pulse
			this.marker+=this.mspp;
			// Loop over in case missed more than one pulse
			diff-=this.mspp;
		}


	}

}

export default new GeneratedClock();