import React from 'react';
import ReactDOM from "react-dom";

export default class ValueBar extends React.Component {


    componentDidMount() {

		this.canvas = this.refs.bar;
		this.width = this.canvas.width = 100;
		this.height = this.canvas.height = 10;

		const context = this.canvas.getContext( "2d" );
		
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

	
	render() {

		return (
			
			<canvas ref="bar"></canvas>
          	
		)

	}

}