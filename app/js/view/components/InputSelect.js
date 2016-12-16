import React from 'react';
import * as SketchActions from '../../actions/SketchActions';
import InputSelectAudio from './InputSelectAudio';
import InputSelectMidi from './InputSelectMidi';

export default class InputSelect extends React.Component {

	constructor(props) {
		super(props);

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
				id = 1760;
				SketchActions.updateSketchParamInput(this.props.sketchId, this.props.paramKey, 'midi', id);
				break

			case 'audio':
				id = 'band_0';
				SketchActions.updateSketchParamInput(this.props.sketchId, this.props.paramKey, 'audio', id);
				break

			default:
				console.error('Input type not recognised: '+type);
		}

	  
	}

	render() {

		const paramKey = this.props.paramKey;

		let inputType, inputId;
		let select;

		if (this.props.input) {
			inputType = this.props.input.type;
			inputId = this.props.input.id;

			if (inputType == 'audio') {
				select = <InputSelectAudio inputId={inputId} sketchId={this.props.sketchId} paramKey={this.props.paramKey} />;
			} else if (inputType == 'midi') {
				select = <InputSelectMidi inputId={inputId} sketchId={this.props.sketchId} paramKey={this.props.paramKey} />;
			}

		} else {
			inputType = 'none';
			inputId = '';
			select = '';
		}

		return (
		  
		  <div>
	          <select value={inputType} onChange={this.handleTypeChange}>
	          		<option value="none">None</option>
	          		<option value="midi">MIDI</option>
	          		<option value="audio">Audio</option>
	          </select>

	          {select}
          </div>
		)
	}

}