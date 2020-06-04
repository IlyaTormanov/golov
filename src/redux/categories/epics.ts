import {RootEpic} from "../root";
import {filter, map, mergeMap} from "rxjs/operators";
import {isActionOf} from "typesafe-actions";
import {categoriesAction} from "./actions";
import {ajax} from "rxjs/ajax";
import {api_v1} from "../../api";
import {from, of} from "rxjs";

export const fetchAllCategoriesEpic:RootEpic=(action$)=>action$.pipe(
    filter(isActionOf(categoriesAction.fetchAllCategory.request)),
    mergeMap(action=>ajax.post(api_v1.categories,action.payload,{
        "Content-Type": "application/json"
    })),
    mergeMap(res=>{
        if(res.status===200){
            return from([

                categoriesAction.fetchAllCategory.success(res.response),
                categoriesAction.categoryPreloader.success(false),
            ])
        }
        else{
            return of( categoriesAction.fetchAllCategory.failure())
        }
    })

);