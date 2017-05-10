import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, browserHistory } from 'react-router';
import reduxThunk from 'redux-thunk';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import routes from './routes'

import reducers from './reducers/index';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);

injectTapEventPlugin();

ReactDOM.render(
    <MuiThemeProvider>
        <Provider store={createStoreWithMiddleware(reducers)}>
            <Router history={browserHistory} routes={routes}/>
        </Provider>
    </MuiThemeProvider>,
    document.querySelector('#root')
);
