import {combineReducers} from "redux";
import {createReducer} from "typesafe-actions";
import {Category} from "../../interfaces";
import {categoriesAction, CategoriesActionType,} from "./actions";

export const categoriesReducers=combineReducers({
   categories:createReducer<Category[],CategoriesActionType>([])
       .handleAction(categoriesAction.fetchAllCategory.success,(state,action)=>action.payload),
   preloader:createReducer<boolean,CategoriesActionType>(true)
       .handleAction(categoriesAction.categoryPreloader.request,(state,action)=>action.payload)
});