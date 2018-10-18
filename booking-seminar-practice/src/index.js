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
import OrganisersSeminar from './components/Seminars/organisersSeminars';
import EditSeminarView from './components/Seminars/editSeminarView';
import Login from './components/users/login';
import EditUsers from './components/users/editUsers';
import AddUsers from './components/users/addUsers';
import SeminarView from './components/Seminars/seminarView';
import PrintNameTags from './components/Seminars/printNameTags';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
        <BrowserRouter>
            <div>
                <Switch>
                    <Route path="/view-seminar"  component={SeminarView} />
                    <Route path="/seminars/your-seminars"  component={OrganisersSeminar} />
                    <Route path="/seminars/print-name-tags"  component={PrintNameTags} />
                    <Route path="/seminars/edit"  component={EditSeminarView} />
                    <Route path="/seminars/new"  component={AddSeminar} />
                    <Route path="/seminars"  component={ListSeminars} />
                    <Route path="/users/edit"  component={EditUsers} />
                    <Route path="/users/addNew"  component={AddUsers} />
                    <Route path="/login"  component={Login} />
                    <Route path="/room/capacity"  component={UpdateCapacity} />
                    <Route path="/" component={App} />
                </Switch>
            </div>
        </BrowserRouter>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();