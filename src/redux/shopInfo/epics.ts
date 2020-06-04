import {RootEpic} from "../root";
import {isActionOf} from "typesafe-actions";
import {catchError, filter, mergeMap} from "rxjs/operators";
import {api_v1} from "../../api";
import {ajax} from "rxjs/ajax";
import {from, of} from "rxjs";
import {shopInfoAction} from "./actions";
import {push} from "connected-react-router";


export const shopInfoEpic: RootEpic = (action$) => action$.pipe(
    filter(isActionOf(shopInfoAction.shopinfo.request)),
    mergeMap(() => ajax.get(api_v1.shopInfo)),
    mergeMap(res => {
            if (res.status === 200) {
                return from([
                    shopInfoAction.shopinfo.success(res.response),
                    push(`/${res.response.cust_id}`),
                ])
            } else {
                return of(
                    shopInfoAction.shopinfo.failure()
                )
            }
        }
    ),
    catchError(() => of(shopInfoAction.shopinfo.failure()))
);