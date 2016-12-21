import Perf from 'react-addons-perf'

window.Perf = Perf;

// React UI 
import './view/main.js';

// Render loop
import './engine/loop';

// Inputs
import './inputs/inputs';

// CSS reload
require('electron-css-reload')();