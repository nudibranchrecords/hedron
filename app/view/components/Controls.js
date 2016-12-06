import React from 'react';
import { Link } from 'react-router';

export default class Controls extends React.Component {
	render() {

		return (
			<div className="controls">
				<ul>
					<li><Link to="/sketch/One">Sketch One</Link></li>
					<li><Link to="/sketch/Two">Sketch Two</Link></li>
				</ul>
			</div>
		)
	}
}