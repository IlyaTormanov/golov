import {ActionType, createAsyncAction} from "typesafe-actions";
import {Category} from "../../interfaces";

export interface categoryRequest{
    cust_ID_Main: string,
    cid?: string,
    advert?: string,
    cust_Id?: number

}

export const categoriesAction={
    fetchAllCategory:createAsyncAction(
        '@CATEGORIES/FETCH_ALL_CATEGORIES_REQUEST',
        '@CATEGORIES/FETCH_ALL_CATEGORIES_SUCCESS',
        '@CATEGORIES/FETCH_ALL_CATEGORIES_FAILURE',
    )<categoryRequest,Category[],undefined>(),
    categoryPreloader:createAsyncAction(
        '@PRELOADER/CATEGORY_REQUEST',
        '@PRELOADER/CATEGORY_SUCCESS',
        '@PRELOADER/CATEGORY_FAILURE',
    )<boolean,boolean,undefined>()
};

export type CategoriesActionType=ActionType<typeof  categoriesAction>