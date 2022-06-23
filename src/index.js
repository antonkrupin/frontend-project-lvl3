import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

import init from './init';
import app from './view';

const state = init();

app(state);
