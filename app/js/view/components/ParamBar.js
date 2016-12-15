import React from 'react';
import ReactDOM from "react-dom";
import * as SketchActions from '../../actions/SketchActions';

export default class ParamBar extends React.Component {

	constructor(props) {
		super(props);

		this.handleRelease = this.handleRelease.bind(this);
		this.handleMove = this.handleMove.bind(this);
	}

    componentDidMount() {

		this.canvas = this.refs.bar;
		const context = this.canvas.getContext( "2d" );
		this.width = this.canvas.width = 100;
		this.height = this.canvas.height = 10;
		
		context.fillStyle = 'red';

  	}
  	
    componentWillReceiveProps(newProps) {

    	this.drawBar(this.props.value, newProps.value)
  	}

  	drawBar(oldVal, newVal) {

  		const context = this.canvas.getContext( "2d" );
  		const pos = this.width * newVal;
  		const oldPos = this.width * oldVal;

		// Only clear the area from the last position
  		context.clearRect(oldPos-1, 0, 4,this.height);

  		// Draw bar at new position
 		context.fillRect(pos, 0, 2, this.height);

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
			
			<div>
          		<canvas ref="bar" className="param-bar" onMouseDown={this.handleClick.bind(this)}></canvas>
          	</div>

		)

	}

}