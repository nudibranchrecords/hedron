import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Layout from './components/Layout';
import Sketches from './components/Sketches';

const app = document.getElementById('app');

ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<IndexRoute component={Sketches}></IndexRoute>
			<Route path="/sketch/id/:sketch" component={Sketches}></Route>
			<Route path="/sketch/:action" component={Sketches}></Route>
		</Route>
	</Router>
, app);