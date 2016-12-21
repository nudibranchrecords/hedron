import React from 'react';
import Analyser from './Analyser';
import * as SketchActions from '../../actions/SketchActions';

export default class Overview extends React.Component {

	save() {
		SketchActions.saveToFile();
	}

	render() {

		return (
			<div className="overview">
				<div id="preview"></div>

				<div className="info">
					<div className="info__module">
						<Analyser/>
					</div>
					<div className="info__module">
						<div id="stats"></div>
					</div>
				</div>
				
				<button onClick={this.save.bind(this)}>Save</button>
			</div>
		)
	}
}