import React from 'react';
import Analyser from './Analyser';
import * as SketchActions from '../../actions/SketchActions';

export default class Overview extends React.Component {

	save() {
		SketchActions.saveToFile();
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
				</div>
				
				<button onClick={this.save.bind(this)}>Save</button>
			</div>
		)
	}
}