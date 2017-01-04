import React from 'react';
import SketchesStore from '../../stores/SketchesStore';
import * as SketchActions from '../../actions/SketchActions';

export default class ModifierControl extends React.Component {


	constructor(props) {
		super(props);

		this.getVal = this.getVal.bind(this);

		this.state = {
			value: 0
		}
	}

	componentWillMount() {
		this.getVal();
	}

	componentWillUnmount() {
		cancelAnimationFrame(this.anim);
	}


	handleChange(i, e) {
		SketchActions.editSketchParamModifier(this.props.sketchId, this.props.paramKey, i, e.target.value);
	}

	getVal() {

		this.setState({
			value: SketchesStore.getParamModifierValue(this.props.sketchId, this.props.paramKey, this.props.index)
		})

		this.anim = requestAnimationFrame(this.getVal);

	}
	
	render() {

		return (
			<div>
              	{this.props.modifierId}: {this.state.value} <br/>
              	<input type="range" value={this.state.value} min="0" max="1" step="0.001" onChange={this.handleChange.bind(this, this.props.modifierId)} />
          	</div>
		)

	}

}