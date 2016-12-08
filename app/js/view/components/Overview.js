import React from 'react';
import Analyser from './Analyser';

export default class Overview extends React.Component {
	render() {

		return (
			<div className="overview">
				<div id="preview"></div>
				<Analyser/>
			</div>
		)
	}
}