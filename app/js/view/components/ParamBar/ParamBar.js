import React from 'react';
import ReactDOM from "react-dom";
import SketchesStore from '../../../stores/SketchesStore';
import * as SketchActions from '../../../actions/SketchActions';
import ValueBar from './ValueBar';

export default class ParamBar extends React.Component {

	constructor(props) {
		super(props);

		this.handleRelease = this.handleRelease.bind(this);
		this.handleMove = this.handleMove.bind(this);

		this.getVal = this.getVal.bind(this);

		this.state = {
			value: 0
		}
	}


	// shouldComponentUpdate(newProps) {
	// 	return false
	// }

	componentWillMount() {
		this.getVal();
	}

	componentWillUnmount() {
		cancelAnimationFrame(this.anim);
	}

	getVal() {

		this.setState({
			value: SketchesStore.getParamValue(this.props.sketchId, this.props.paramKey)
		})

		this.anim = requestAnimationFrame(this.getVal);

	}


  	
	handleClick(e) {

		this.initialX = e.clientX;
		this.initialVal = this.props.value;

		document.addEventListener('mouseup', this.handleRelease);
		document.addEventListener('mousemove', this.handleMove);
	}

	handleRelease() {

		document.removeEventListener('mouseup', this.handleRelease);
		document.removeEventListener('mousemove', this.handleMove);

	}

	handleMove(e) {

		const x = Math.max(Math.min(this.initialVal + ((e.clientX - this.initialX) / 200), 1), 0);

		SketchActions.editSketchParam(this.props.sketchId, this.props.paramKey, x);

	}
	
	render() {

		let textVal = this.state.value;

		if (this.props.type == 'posNeg') {

			textVal = Math.round((textVal - 0.5) * 200)/100;
		
		}

		return (
			
			<div>
				<h3 data-Param-Header>{this.props.paramName} : {textVal}</h3>
				<div data-ParamBar onMouseDown={this.handleClick.bind(this)}>
	          		<ValueBar value={this.state.value} />
	          	</div>
          	</div>

		)

	}

}