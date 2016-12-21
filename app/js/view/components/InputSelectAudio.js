import React from 'react';
import AudioBandsStore from '../../stores/AudioBandsStore';
import * as SketchActions from '../../actions/SketchActions';

export default class InputSelectAudio extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			keys: AudioBandsStore.getKeys()
		};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {

		const id = e.target.value;
		
		SketchActions.updateSketchParamInput(this.props.sketchId, this.props.paramKey, 'audio', id);

	}

	render() {

		const paramKey = this.props.paramKey;
		const keys = this.state.keys;

		return (
		  
		  <div>
	          <select value={this.props.id} onChange={this.handleChange}>
	          	{Object.keys(keys).map(function(key) {
		            return <option key={key}>{keys[key]}</option>
		        })}
	          </select>
          </div>

		)
	}

}