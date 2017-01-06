import React from 'react';
import Analyser from './Analyser';
import Clock from './Clock';
import * as SketchActions from '../../actions/SketchActions';
import * as DisplayActions from '../../actions/DisplayActions';


export default class Overview extends React.Component {

	save() {
		SketchActions.saveToFile();
	}

	initDisplay() {
		DisplayActions.initDisplay();
	}

	render() {

		return (
			<div data-Overview>
				<div id="preview"></div>

				<div data-Stats>
					<div data-Stats-Module>
						<Analyser/>
					</div>
					<div data-Stats-Module>
						<div id="stats"></div>
					</div>
					<div data-Stats-Module>
						<Clock/>
					</div>
				</div>
				
				<button onClick={this.save.bind(this)}>Save</button>
				<button onClick={this.initDisplay.bind(this)}>Send to display</button>

				
			</div>
		)
	}
}