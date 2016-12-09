import React from 'react';
import AudioBandsStore from '../../stores/AudioBandsStore';
import * as SketchActions from '../../actions/SketchActions';

export default class Param extends React.Component {

	constructor(props) {
		super(props);
		
		this.keys = AudioBandsStore.getKeys();
		this.state = {value: this.props.inputId}

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		const val = event.target.value;
	    this.setState({value: val});
	    SketchActions.updateSketchParamInput(this.props.sketchId, this.props.paramKey, val);
	}

	render() {

		const paramKey = this.props.paramKey;

		return (
			
          <select value={this.state.value} onChange={this.handleChange}>
          		<option value="manual">Manual</option>
          		{this.keys.map(function(key, i){
			        return <option value={key} key={i}>{key}</option>
			    })}
          </select>

		)
	}

}