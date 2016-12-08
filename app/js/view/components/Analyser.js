import React from 'react';
import ReactDOM from "react-dom";
import AudioInputs from '../../inputs/AudioInputs';
import AudioBandsStore from '../../stores/AudioBandsStore';

export default class Analyser extends React.Component {

	constructor(props) {
		super(props);

		AudioInputs.on('updated', this.update.bind(this));
		
	}

	componentDidMount() {
	   
 	   this.graph();

 	}

 	componentDidUpdate() {
	   
 	  this.graph();

 	}

 	graph() {
 	   this.canvas = ReactDOM.findDOMNode(this);
	   this.context = this.canvas.getContext( "2d" );
	   this.height = this.canvas.height;
	   this.width = this.canvas.width;
	   this.barCount = AudioBandsStore.getCount();
	   this.barWidth = this.width/this.barCount;
 	}



 	drawGraph() {

 		const data = AudioInputs.getData();

 		this.context.fillStyle = 'black';
		this.context.fillRect( 0, 0, this.width, this.height );

		// Create background bars
		for ( let i = 0; i < data.length; i++ ) {

			const val = data[ i ];
			const height = this.height * val;
			const offset = this.height - height - 1;
			const hue = i / data.length * 360;

			this.context.fillStyle = 'hsla(' + hue + ', 100%, 50%, 1)';
			this.context.fillRect( i * this.barWidth, offset, this.barWidth, height );

		}

	}

	update() {
		this.drawGraph();
	}

	render() {

		return (
			
          	<canvas></canvas>

		)
	}

}