import React from 'react';
import Overview from './Overview';

export default class Layout extends React.Component {
	render() {

		return (

			<div data-Layout>
				<div data-Layout-Module>
					{this.props.children}
				</div>
				<div  data-Layout-Module="overview">
					<Overview />
				</div>
			</div>

		)
	}
}