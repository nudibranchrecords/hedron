import React from 'react';
import Sketch from './Sketch';
import SketchesStore from '../../stores/SketchesStore';
import { Link } from 'react-router';


export default class Sketches extends React.Component {

	constructor() {
		super();

		this.getItems = this.getItems.bind(this);
		
		this.state = {
			sketches: SketchesStore.getAll()
		}

	}

	componentWillMount() {
		SketchesStore.on('change', this.getItems);
	}

	componentWillUnmount() {
		SketchesStore.removeListener('change', this.getItems);
	}

	getItems() {
		this.setState({
			items: SketchesStore.getAll()
		})
	}

	render() {

		const currentSketchId = this.props.routeParams.sketch;
		const { sketches } = this.state;

		const currentSketch = sketches[currentSketchId];

		return (
			<div>
			
				<ul>
		            {Object.keys(sketches).map(function(key) {
		              return <li key={key}><Link to={'/sketch/'+sketches[key].id}>{sketches[key].title}</Link></li>
		            })}
		        </ul>

		        <Sketch sketch={currentSketch} />

			</div>
		)
	}
}