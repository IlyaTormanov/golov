import *  as React from "react";
import {Component, FunctionComponent} from "react";
import {ConnectedRouter} from "connected-react-router";
import {Route, Switch} from "react-router-dom";
import {CreateProduct} from "./components/static/productCreator/createProduct";
import App from "./App";
import {history} from "./index";
import {useEffect} from "react";
import {shopInfoAction} from "./redux/shopInfo/actions";
import {useDispatch} from "react-redux";
import {PrivateOffice} from "./components/static/privateOffice/privateOffice";



const Root: FunctionComponent = () => {
    const dispatch=useDispatch();
    useEffect(() => {
        dispatch(shopInfoAction.shopinfo.request())
    }, [dispatch]);
    return <div></div>
};

export const Main:FunctionComponent=()=>{

    return(
        <ConnectedRouter history={history}>
            <Switch>
                <Route exact path={'/'} component={Root}/>
                <Route path={'/:cust_id/addProduct'}  component={CreateProduct}/>
                <Route path={'/:cust_id/personalClient'} component={PrivateOffice}/>
                <Route path={'/:cust_id'} component={App}/>

            </Switch>
        </ConnectedRouter>
    )
}