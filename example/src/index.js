import React from 'react';
import ReactDOM from 'react-dom';
import JaeGeun from './JaeGeun';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<JaeGeun />, document.getElementById('root'));

serviceWorker.unregister();
