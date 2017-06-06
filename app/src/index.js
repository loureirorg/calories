// core
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import thunkMiddleware from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';

// assets
import './index.css';

// reducers
import {
  reducerModalAdd,
  reducerModalEdit,
  reducerModalEditUser,
  reducerModalLostPassword,
  reducerUser,
  reducerUsers,
  reducerAdminUser,
  reducerMeals,
  reducerSettings,
  reducerFilter,
  reducerFilterDialog,
  reducerModalAddUser,

  userFetch
} from './reducers';

// pages
import Home from './views/Home/Home';
import App from './views/App/App';
import SignIn from './views/SignIn/SignIn';
import SignUp from './views/SignUp/SignUp';
import LostPassword from './views/LostPassword/LostPassword';
import ChangePassword from './views/ChangePassword/ChangePassword';
import Page404 from './views/Page404/Page404';

// Create a store with several reducers
let store = createStore(
  combineReducers({
    routing: routerReducer,
    modal_add: reducerModalAdd,
    modal_edit: reducerModalEdit,
    modal_edit_user: reducerModalEditUser,
    modal_add_user: reducerModalAddUser,
    modal_settings: reducerSettings,
    modal_filter: reducerFilter,
    modal_lost_password: reducerModalLostPassword,
    user: reducerUser,
    users: reducerUsers,
    admin_user: reducerAdminUser,
    meals: reducerMeals,
    filter_dialog: reducerFilterDialog,
  }),
  applyMiddleware(
    thunkMiddleware
  )
);

// // load jquery / materialize
// function loadjscssfile(filename, filetype){
//     if (filetype==="js"){ //if filename is a external JavaScript file
//         var fileref=document.createElement('script')
//         fileref.setAttribute("type","text/javascript")
//         fileref.setAttribute("src", filename)
//     }
//     else if (filetype==="css"){ //if filename is an external CSS file
//         var fileref=document.createElement("link")
//         fileref.setAttribute("rel", "stylesheet")
//         fileref.setAttribute("type", "text/css")
//         fileref.setAttribute("href", filename)
//     }
//     if (typeof fileref!=="undefined")
//         document.getElementsByTagName("head")[0].appendChild(fileref)
// }
// loadjscssfile('materialize.min.js', 'js');

// create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(createHistory(), store);

// session
store.dispatch(userFetch());

ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/lost-password" component={LostPassword} />
        <Route path="/change-password" component={ChangePassword} />
        <Route path="/" component={App} />
        <Route path="/" component={Page404} />
      </Switch>
    </Router>
  </Provider>
  ), document.getElementById('root'));
registerServiceWorker();
