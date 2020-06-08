import {ActionType, createAction, createAsyncAction} from "typesafe-actions";
import {Product, ProductDescription} from "../../interfaces";


export interface GalleryRequest {
    data:{
        CID?: string|null,
        Cust_ID: string,
        ID: string
    },
    paginateInfo:{
        PageNumber:number,
        CountOnPage:number
    }
}

export interface GalleryProductRequest {
    appCode: string,
    cust_ID: string,
    prc_ID: string
}

export const galleryActions = {
    fetchGallery: createAsyncAction(
        '@GALLERY/FETCH_GALLERY_REQUEST',
        '@GALLERY/FETCH_GALLERY_SUCCESS',
        '@GALLERY/FETCH_GALLERY_FAILURE',
    )<GalleryRequest, {
        res: Product[], pageInfoOutput: {
            totalPages: number,
            countOnPage: number,
            pageNumber: number
        }
    }, undefined>(),
    galleryPreloader: createAsyncAction(
        '@PRELOADER/GALLERY_PRELOADER_REQUEST',
        '@PRELOADER/GALLERY_PRELOADER_SUCCESS',
        '@PRELOADER/GALLERY_PRELOADER_FAILURE',
    )<boolean, boolean, undefined>(),
    paginateState:createAction(
        '@PAGINATE/CHANGE_PAGINATE_STATE'
    )<number>(),
    fetchGalleryProduct: createAsyncAction(
        '@GALLERY/FETCH_GALLERY_PRODUCT_REQUEST',
        '@GALLERY/FETCH_GALLERY_PRODUCT_SUCCESS',
        '@GALLERY/FETCH_GALLERY_PRODUCT_FAILURE',
    )<GalleryProductRequest, ProductDescription, undefined>(),
    productPreloader: createAsyncAction(
        '@PRELOADER/PRODUCT_PRELOADER_REQUEST',
        '@PRELOADER/PRODUCT_PRELOADER_SUCCESS',
        '@PRELOADER/PRODUCT_PRELOADER_FAILURE',
    )<boolean, boolean, undefined>()
};

export type galleryActionsType = ActionType<typeof galleryActions>