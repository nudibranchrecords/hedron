import React from 'react';
import ReactDOM from "react-dom";
import * as SketchActions from '../../../actions/SketchActions';
import ValueBar from './ValueBar';

export default class ParamBar extends React.Component {

	constructor(props) {
		super(props);

		this.handleRelease = this.handleRelease.bind(this);
		this.handleMove = this.handleMove.bind(this);
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

		return (
			
			<div data-ParamBar onMouseDown={this.handleClick.bind(this)}>
          		<ValueBar value={this.props.value} />
          	</div>

		)

	}

}