import React from 'react';

import SketchesStore from '../../stores/SketchesStore';

import { browserHistory } from 'react-router';

import Sketch from './Sketch';
import SketchCreate from './SketchCreate';
import SketchesNav from './SketchesNav';

export default class Sketches extends React.Component {

	constructor() {
		super();

		this.getSketches = this.getSketches.bind(this);

		this.state = {
			sketches: SketchesStore.getAll()
		}

	}

	componentWillMount() {
		SketchesStore.on('change', this.getSketches);
	}

	componentWillUnmount() {
		SketchesStore.removeListener('change', this.getSketches);
	}

	getSketches() {
		this.setState({
			sketches: SketchesStore.getAll()
		})
	}

	render() {

		const { sketches } = this.state;

		let viewComponent;
		let action = this.props.routeParams.action;

		if (action == 'create') {

			viewComponent = <SketchCreate />;

		} else {	

			let currentSketch;
			let currentSketchId = this.props.routeParams.sketch;

			// Set the current displayed sketch as the last one if not defined (e.g. deleted)
			if (!currentSketchId || !sketches[currentSketchId]) {
				currentSketch = sketches[Object.keys(sketches)[Object.keys(sketches).length - 1]]
			} else {
				currentSketch = sketches[currentSketchId];
			}

			viewComponent = <Sketch sketch={currentSketch} />;

		}

	

		return (
			<div>
			
				<SketchesNav sketches={sketches} />
		        {viewComponent}

			</div>
		)
	}
}