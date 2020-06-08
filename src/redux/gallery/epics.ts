import {RootEpic} from "../root";
import {isActionOf} from "typesafe-actions";
import {catchError, filter, map, mergeMap} from "rxjs/operators";
import {galleryActions} from "./actions";
import {ajax} from "rxjs/ajax";

import {from, of} from "rxjs";
import {api_v1} from "../../api";



export const fetchGalleryEpic: RootEpic = (action$) => action$.pipe(
    filter(isActionOf(galleryActions.fetchGallery.request)),
    mergeMap(action => ajax.post(`${api_v1.gallery}?PageNumber=${action.payload.paginateInfo.PageNumber}&CountOnPage=${action.payload.paginateInfo.CountOnPage}`, action.payload.data, {
        "Content-Type": "application/json"
    })),
    mergeMap(res => {
        if (res.status === 200) {

            return from([
                galleryActions.fetchGallery.success(res.response),
                galleryActions.paginateState(res.response.pageInfoOutput.pageNumber),
                galleryActions.galleryPreloader.success(false),
            ])
        } else {
            return of(galleryActions.fetchGallery.failure())
        }

    })
);

export const galleryProductEpic: RootEpic = (action$) => action$.pipe(
    filter(isActionOf(galleryActions.fetchGalleryProduct.request)),
    mergeMap(action => ajax.post(api_v1.galleryProduct, action.payload, {
        "Content-Type": "application/json"
    })),
    mergeMap(res =>{
        if(res.status===200){

                return from([
                    galleryActions.fetchGalleryProduct.success(res.response),
                    galleryActions.productPreloader.success(false)
                ])


        }
        else{
            return of( galleryActions.fetchGalleryProduct.failure())
        }
    }
    ),
    catchError(()=>of(galleryActions.fetchGalleryProduct.failure()))
);