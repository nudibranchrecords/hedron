import React from 'react';

import SketchesStore from '../../stores/SketchesStore';

import { browserHistory } from 'react-router';

import Sketch from './Sketch';
import SketchesNav from './SketchesNav';

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

		const { sketches } = this.state;

		let currentSketch;
		let currentSketchId = this.props.routeParams.sketch;

		// Set the current displayed sketch as the last one if not defined (e.g. deleted)
		if (!currentSketchId || !sketches[currentSketchId]) {
			currentSketch = sketches[Object.keys(sketches)[Object.keys(sketches).length - 1]]
		} else {
			currentSketch = sketches[currentSketchId];
		}

		return (
			<div>
			
				<SketchesNav sketches={sketches} />
		        <Sketch sketch={currentSketch} />

			</div>
		)
	}
}