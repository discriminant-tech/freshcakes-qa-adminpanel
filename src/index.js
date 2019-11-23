import React from 'react';
import ReactDOM from 'react-dom';
import './style/custom.css';
import Home from '../src/components/Home/home';

import * as serviceWorker from './serviceWorker';
ReactDOM.render(<Home />, document.getElementById('root'));
serviceWorker.unregister();
