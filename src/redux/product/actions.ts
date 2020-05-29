import {ActionType, createAction, createAsyncAction, createReducer} from "typesafe-actions";
import {AddProduct} from "../../interfaces";
import {combineReducers} from "redux";


export const productActions={
  uploadImage:createAsyncAction(
      '@PRODUCT/UPLOAD_IMAGES_REQUEST',
      '@PRODUCT/UPLOAD_IMAGES_SUCCESS',
      '@PRODUCT/UPLOAD_IMAGES_FAILURE',
  )<File,{result:boolean},undefined>(),

    addProduct:createAsyncAction(
        '@PRODUCT/ADD_PRODUCT_REQUEST',
        '@PRODUCT/ADD_PRODUCT_SUCCESS',
        '@PRODUCT/ADD_PRODUCT_FAILURE',
    )<{product: AddProduct, images: string[]},{status:number},{status:number}>(),
    addProductPreloader:createAsyncAction(
        '@PREALOADER/ADD_PRODUCT_PRELOADER_REQUEST',
        '@PREALOADER/ADD_PRODUCT_PRELOADER_SUCCESS',
        '@PREALOADER/ADD_PRODUCT_PRELOADER_FAILURE'

    )<boolean,boolean>()

};
export type ProductActionType=ActionType<typeof productActions>
export const productReducer=combineReducers({
  productSuccess:createReducer<{status:number},ProductActionType>({status:0})
      .handleAction(productActions.addProduct.success,(state,action)=>action.payload),
  productFailure:createReducer<{status:number},ProductActionType>({status:0})
      .handleAction(productActions.addProduct.failure,(state,action)=>action.payload),
  isAdd:createReducer<boolean,ProductActionType>(true)
      .handleAction(productActions.addProductPreloader.request,(state,action)=>action.payload)
      .handleAction(productActions.addProductPreloader.success,(state,action)=>action.payload)
  ,
    }


)

