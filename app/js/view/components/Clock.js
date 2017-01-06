import React from 'react';
import ClockStore from '../../stores/ClockStore';

export default class Analyser extends React.Component {

	constructor() {

		super();

		this.getCurrentBeat = this.getCurrentBeat.bind(this);

		this.state = {
			beat: ClockStore.getCurrentBeat()
		}
		
	}

	getCurrentBeat() {
		this.setState({
			beat: ClockStore.getCurrentBeat()
		})
	}

	componentWillMount() {
		ClockStore.on('change', this.getCurrentBeat);
	}

	componentWillUnmount() {
		ClockStore.removeListener('change', this.getCurrentBeat);
	}

	render() {

		return (
			
          	<div>
          		{this.state.beat}
          	</div>

		)
	}

}