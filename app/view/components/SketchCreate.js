import React from 'react';

import SketchFilesStore from '../../stores/SketchFilesStore';
import * as SketchActions from '../../actions/SketchActions';

export default class SketchCreate extends React.Component {


	constructor() {
		super();

		this.state = {
			sketchFiles: SketchFilesStore.getAll()
		}
	}


	create(fileName) {
		SketchActions.createSketch(fileName);
	}

	render() {

		const items = this.state.sketchFiles.map((fileName, i) => {

	        return <li key={i} onClick={this.create.bind(this, fileName)}>{fileName}</li>;

	    });

		return (
			<div>
				<h2>Add Sketch</h2>
				<ul>
					{items}
		        </ul>
	        </div>
		)
	}

}