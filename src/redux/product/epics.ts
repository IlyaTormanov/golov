import {combineEpics} from "redux-observable";
import {RootEpic} from "../root";
import {isActionOf} from "typesafe-actions";
import {catchError, delay, filter, map, mergeMap} from "rxjs/operators";
import {productActions} from "./actions";
import {ajax} from "rxjs/ajax";
import {api_v1} from "../../api";
import {concat, EMPTY, forkJoin, from, of, throwError} from "rxjs";

export const prepareToFormData = (data: Object) => {
    const result = new FormData();
    Object.entries(data).forEach(([key, value]) => result.append(key, value))
    return result
};

export const addProduct: RootEpic = (action$, state$) => action$.pipe(
    filter(isActionOf(productActions.addProduct.request)),
    mergeMap(({payload: {product, images}}) => ajax.post(api_v1.addProduct, product, {
        "Content-Type": "application/json"
    }).pipe(
        mergeMap(res => {
            if (res.status === 200) {
                forkJoin(images.map((tImage, imageOrder) => ajax.post(api_v1.additionalImage, {
                    catalog: product.Catalog,
                    id: product.Id,
                    prc_ID: res.response.prc_id,
                    imageOrder,
                    tImage,
                    appcode: product.Appcode,
                    cid: state$.value.auth.auth.userId,
                }, {
                    "Content-Type": "application/json"
                }))).subscribe();
                return concat(
                    of(productActions.addProduct.success({status: res.status})),
                    of(productActions.addProduct.success({status: 0})).pipe(
                        delay(3000)
                    ),
                )
            }
            return of(productActions.addProduct.failure({status: res.status}))
        }),
    )),
    catchError(() => from([productActions.addProduct.failure({status: 500}), productActions.addProductPreloader.success(false)]))
);


export const productEpics = combineEpics(
    addProduct
);
