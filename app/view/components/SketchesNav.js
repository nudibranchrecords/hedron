import React from 'react';

import { Link } from 'react-router';

import Param from './Param';

import { createSketch } from '../../actions/SketchActions';

export default class SketchesNav extends React.Component {

	create() {
		createSketch('Demo');
	}

	render() {

		const sketches = this.props.sketches;

		return (
			<nav>
				<ul>
		            {Object.keys(sketches).map(function(key) {
		              return <li key={key}><Link to={'/sketch/'+sketches[key].id}>{sketches[key].title}</Link></li>
		            })}

		            <li><a onClick={this.create.bind(this)}>Add New</a></li>
		        </ul>
			</nav>
		)
	}

}