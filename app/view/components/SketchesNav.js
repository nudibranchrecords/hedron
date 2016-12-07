import React from 'react';

import { Link } from 'react-router';

import Param from './Param';

export default class SketchesNav extends React.Component {

	render() {

		const sketches = this.props.sketches;

		return (
			<nav>
				<ul>
		            {Object.keys(sketches).map(function(key) {
		              return <li key={key}><Link to={'/sketch/id/'+sketches[key].id}>{sketches[key].title}</Link></li>
		            })}

		            <li>+<Link to={'/sketch/create'}>Add New</Link></li>
		        </ul>
			</nav>
		)
	}

}