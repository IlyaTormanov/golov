import {combineReducers} from "redux";
import {createReducer} from "typesafe-actions";

import {galleryActions, galleryActionsType} from "./actions";
import {Product, ProductDescription} from "../../interfaces";



export const galleryProductInit:ProductDescription={
    addr: "",
    catalog: "",
    code_1C: "",
    ctlg_Name: "",
    ctlg_No: "",
    delivery: "",
    id: "",
    isprice: "",
    latitude: null,
    longitude: null,
    phoneclient: "",
    prc_Br: "",
    prc_ID: 21829,
    qty: "",
    sup_ID: "",
    suplier: "",
    tDescription: "",
    tName: "",
    t_imageprev: "",
    v_isnoprice: "",
    wgt: "",
    youtube: ""

};

export const galleryReducer=combineReducers({
    gallery:createReducer<{res: Product[], pageInfoOutput: {
            totalPages: number,
            countOnPage: number,
            pageNumber: number
        }},galleryActionsType>({pageInfoOutput: {countOnPage: 0, pageNumber: 0, totalPages: 0}, res: []})
        .handleAction(galleryActions.fetchGallery.success,(state,action)=>action.payload),
    paginate:createReducer<number,galleryActionsType>(1)
        .handleAction(galleryActions.paginateState,(state,action)=>action.payload),
    galleryProduct:createReducer<ProductDescription,galleryActionsType>(galleryProductInit)
        .handleAction(galleryActions.fetchGalleryProduct.success,(state,action)=>action.payload),
    galleryPreloader:createReducer<boolean,galleryActionsType>(true)
        .handleAction(galleryActions.galleryPreloader.success,(state,action)=>action.payload),
    productPreloader:createReducer<boolean,galleryActionsType>(true)
        .handleAction(galleryActions.productPreloader.success,(state,action)=>action.payload)
});