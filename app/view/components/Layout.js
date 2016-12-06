import React from 'react';
import Overview from './Overview';
import Controls from './Controls';

export default class Layout extends React.Component {
	render() {

		return (

			<div className="layout">
				<div className="layout__module">
					<Overview />
				</div>
				<div className="layout__module">
					{this.props.children}
				</div>
			</div>

		)
	}
}