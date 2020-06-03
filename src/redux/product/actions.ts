import {ActionType, createAction, createAsyncAction, createReducer} from "typesafe-actions";
import {AddProduct} from "../../interfaces";
import {combineReducers} from "redux";


export const productActions={
  uploadImage:createAsyncAction(
      '@PRODUCT/UPLOAD_IMAGES_REQUEST',
      '@PRODUCT/UPLOAD_IMAGES_SUCCESS',
      '@PRODUCT/UPLOAD_IMAGES_FAILURE',
  )<File,{result:boolean},undefined>(),
    redactProduct:createAsyncAction(
        '@PRODUCT/REDACT_PRODUCT_REQUEST',
        '@PRODUCT/REDACT_PRODUCT_SUCCESS',
        '@PRODUCT/REDACT_PRODUCT_FAILURE',
    )<{product: AddProduct, images: string[]},{status:number},{status:number}>(),
    removeMainImage:createAction(
        '@PRODUCT/REMOVE_MAIN_IMAGE'
    )<string>(),
  removeAdditionalImages:createAction('@PRODUCT/REMOVE_ADDITIONAL_IMAGE')<string>(),
  addAdditionalImages:createAction('PRODUCT/ADD_ADDITIONAL_IMAGES')<string>(),
    addProduct:createAsyncAction(
        '@PRODUCT/ADD_PRODUCT_REQUEST',
        '@PRODUCT/ADD_PRODUCT_SUCCESS',
        '@PRODUCT/ADD_PRODUCT_FAILURE',
    )<{product: AddProduct, images: string[]},{status:number},{status:number}>(),
    addProductPreloader:createAsyncAction(
        '@PREALOADER/ADD_PRODUCT_PRELOADER_REQUEST',
        '@PREALOADER/ADD_PRODUCT_PRELOADER_SUCCESS',
        '@PREALOADER/ADD_PRODUCT_PRELOADER_FAILURE'

    )<boolean,boolean,undefined>()

};
export type ProductActionType=ActionType<typeof productActions>
export const productReducer=combineReducers({
  productSuccess:createReducer<{status:number},ProductActionType>({status:0})
      .handleAction(productActions.addProduct.success,(state,action)=>action.payload),
  productFailure:createReducer<{status:number},ProductActionType>({status:0})
      .handleAction(productActions.addProduct.failure,(state,action)=>action.payload),
  redactProduct:createReducer<{product: AddProduct, images: string[]},ProductActionType>({
    images: [],
    product: {
      Appcode: "",
      CID: "",
      Catalog: "",
      Ctlg_Name: "",
      Id: "",
      PrcNt: "",
      TArticle: "",
      TCost: "",
      TDescription: "",
      TImageprev: "",
      TName: "",
      TransformMech: "",
      TypeProd: "",
      video: ""
    }
  })
      .handleAction(productActions.redactProduct.request,(state,action)=>action.payload)
      .handleAction(productActions.removeMainImage,(state,action)=>{ return {
        images: state.images,
        product: {
          ...state.product,
          TImageprev: action.payload,
        }
      }})
      .handleAction(productActions.removeAdditionalImages,(state,action)=>{
        return {
          product:state.product,
          images:state.images.filter(img=>img!==action.payload)
        }
      })
      .handleAction(productActions.addAdditionalImages,(state,action)=>{
        return{
          product:state.product,
          images:[...state.images,action.payload]
        }
      })

  ,
  isAdd:createReducer<boolean,ProductActionType>(true)
      .handleAction(productActions.addProductPreloader.request,(state,action)=>action.payload)
      .handleAction(productActions.addProductPreloader.success,(state,action)=>action.payload)
  ,
    }


)

