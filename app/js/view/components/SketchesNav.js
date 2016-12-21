import React from 'react';

import { Link } from 'react-router';

import Param from './Param';

export default class SketchesNav extends React.Component {

	render() {

		const sketches = this.props.sketches;

		return (
			<nav data-SketchesNav>
				<ul>
		            {Object.keys(sketches).map(function(key) {
		              return <li data-SketchesNav-Item key={key}><Link activeClassName='active' to={'/sketch/id/'+sketches[key].data.id}>{sketches[key].data.title}</Link></li>
		            })}

		            <li data-SketchesNav-Item><Link to={'/sketch/create'}>+ New</Link></li>
		        </ul>
			</nav>
		)
	}

}