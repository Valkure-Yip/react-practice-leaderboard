import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App apiroot="https://fcctop100.herokuapp.com/api/fccusers/" />, document.getElementById('root'));
registerServiceWorker();
