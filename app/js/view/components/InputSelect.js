import React from 'react';
import AudioBandsStore from '../../stores/AudioBandsStore';
import * as SketchActions from '../../actions/SketchActions';

export default class Param extends React.Component {

	constructor(props) {
		super(props);

		let input = false;
		
		this.keys = AudioBandsStore.getKeys();

		this.state = {};

		if (this.props.input) {
			this.state = {
				type: this.props.input.type, 
				id: this.props.input.id
			};
		}
		

		this.handleTypeChange = this.handleTypeChange.bind(this);
	}

	handleTypeChange(e) {
		const type = e.target.value;
		let id = false;


	    switch(type) {

			case 'none':

				SketchActions.deleteSketchParamInput(this.props.sketchId, this.props.paramKey);
				break

			case 'midi':
				// Start MIDI learn
				id = 1762;
				SketchActions.updateSketchParamInput(this.props.sketchId, this.props.paramKey, 'midi', id);
				break

			case 'audio':
				id = 'band_0';
				SketchActions.updateSketchParamInput(this.props.sketchId, this.props.paramKey, 'audio', id);
				break

			default:
				console.error('Input type not recognised: '+type);
		}

		this.setState({
	    	type,
	    	id
	    });

	  
	}

	render() {

		const paramKey = this.props.paramKey;

		return (
		  
		  <div>
	          <select value={this.state.type} onChange={this.handleTypeChange}>
	          		<option value="none">None</option>
	          		<option value="midi">MIDI</option>
	          		<option value="audio">Audio</option>
	          </select>

	          {this.state.id}
          </div>
		)
	}

}