import {createReducer} from "typesafe-actions";
import {combineReducers} from "redux";
import {ShopInfo, shopInfoAction, shopInfoActionType} from "./actions";

export const shopInfoData: ShopInfo = {
    cust_id: "",
    mainImage: "",
    mainPictureAccountUser: ""

};

export const shopInfoReducers = combineReducers({
    shopInfo: createReducer<ShopInfo, shopInfoActionType>(shopInfoData)
        .handleAction(shopInfoAction.shopinfo.success, (state, action) => action.payload)
});