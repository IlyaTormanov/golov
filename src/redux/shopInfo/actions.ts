import {ActionType, createAsyncAction} from "typesafe-actions";


export interface ShopInfo {
    cust_id: string,
    mainImage: string,
    mainPictureAccountUser: string
}

export const shopInfoAction = {
    shopinfo: createAsyncAction(
        '@SHOPINFO/SHOPINFO_REQUEST',
        '@SHOPINFO/SHOPINFO_SUCCESS',
        '@SHOPINFO/SHOPINFO_FAILURE',
    )<undefined, ShopInfo, undefined>(),

};

export type shopInfoActionType = ActionType<typeof shopInfoAction>