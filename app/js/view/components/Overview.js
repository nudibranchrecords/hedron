import React from 'react';
import Analyser from './Analyser';

export default class Overview extends React.Component {
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
				
			</div>
		)
	}
}