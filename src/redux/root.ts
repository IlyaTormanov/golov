import {combineReducers} from "redux";
import {combineEpics, Epic} from "redux-observable";
import {ActionType, StateType} from "typesafe-actions";
import {shopInfoEpic} from "./shopInfo/epics";
import {shopInfoReducers} from "./shopInfo/reducers";
import {shopInfoAction} from "./shopInfo/actions";
import {categoriesAction} from "./categories/actions";
import {categoriesReducers} from "./categories/reducers";
import {fetchAllCategoriesEpic} from "./categories/epics";
import {galleryReducer} from "./gallery/reducers";
import {galleryActions} from "./gallery/actions";
import {fetchGalleryEpic, galleryProductEpic} from "./gallery/epics";
import {History} from "history";
import {connectRouter, RouterAction} from "connected-react-router";
import {authActions} from "./auth/actions";
import {authEpics} from "./auth/epics";
import {authReducer} from "./auth/reducers";
import {productActions, productReducer} from "./product/actions";
import {productEpics} from "./product/epics";





export const rootAction = {
    shopInfo: shopInfoAction,
    category: categoriesAction,
    gallery:galleryActions,
    auth:authActions,
    product:productActions
};

export type RootActionType = RouterAction|ActionType<typeof rootAction>

export const rootReducer = (history: History)=>combineReducers({
    shopInfo: shopInfoReducers,
    categories: categoriesReducers,
    gallery:galleryReducer,
    auth:authReducer,
    router:connectRouter(history),
    product:productReducer,

});

export type RootStateType = StateType<ReturnType <typeof rootReducer>>

export const rootEpic = combineEpics(
    shopInfoEpic,
    fetchAllCategoriesEpic,
    fetchGalleryEpic,
    galleryProductEpic,
    authEpics,
    productEpics
);

export type RootEpic = Epic<RootActionType, RootActionType, RootStateType>;
