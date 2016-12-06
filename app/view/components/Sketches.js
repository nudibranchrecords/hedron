import React from 'react';

import SketchesStore from '../../stores/SketchesStore';

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

		let currentSketchId = this.props.routeParams.sketch;

		if (!currentSketchId) {
			currentSketchId = 1;
		}

		const { sketches } = this.state;
	
		const currentSketch = sketches[currentSketchId];

		return (
			<div>
			
				<SketchesNav sketches={sketches} />
		        <Sketch sketch={currentSketch} />

			</div>
		)
	}
}