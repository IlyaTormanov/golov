import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {createEpicMiddleware} from "redux-observable";
import {RootActionType, rootEpic, rootReducer, RootStateType} from "./redux/root";
import {applyMiddleware, createStore} from "redux";
import {Provider} from "react-redux";
import {createBrowserHistory} from "history";
import {  Route, Switch} from 'react-router-dom'
import {ConnectedRouter, routerMiddleware} from 'connected-react-router'
import {composeWithDevTools} from "redux-devtools-extension";
import {authActions} from "./redux/auth/actions";
import {CreateProduct} from "./components/static/productCreator/createProduct";
import {Main} from "./main";

const epicMiddleware=createEpicMiddleware<RootActionType,RootActionType,RootStateType>();
export  const history = createBrowserHistory();

export default function configureStore() {
    const store = createStore(
        rootReducer(history),
        composeWithDevTools( applyMiddleware(epicMiddleware,routerMiddleware(history)))
    );

    epicMiddleware.run(rootEpic);
    return store;
}
export const userData=localStorage.getItem('user_data');

const store=configureStore();
if(userData){
    try{
        store.dispatch(authActions.login.success(JSON.parse(userData)))
    }
    catch(e){

    }
}



ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
      <Main/>
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
