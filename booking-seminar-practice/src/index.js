import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route, Switch }  from 'react-router-dom';
import { Provider } from 'react-redux';
import promise from 'redux-promise';
import reducers from './reducers';


// Components
import App from './App';
import UpdateCapacity from './components/rooms/updateCapacity';
import AddSeminar from './components/Seminars/addSeminar';
import ListSeminars from './components/Seminars/listSeminars';
import EditSeminar from './components/Seminars/editSeminar';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
        <BrowserRouter>
            <div>
                <Switch>
                    <Route path="/seminars/new"  component={AddSeminar} />
                    <Route path="/seminars/edit"  component={EditSeminar} />
                    <Route path="/seminars"  component={ListSeminars} />
                    <Route path="/room/capacity"  component={UpdateCapacity} />
                    <Route path="/" component={App} />
                </Switch>
            </div>
        </BrowserRouter>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
