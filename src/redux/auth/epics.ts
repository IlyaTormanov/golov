import {RootEpic} from "../root";
import {isActionOf} from "typesafe-actions";
import {catchError, filter, map, mergeMap, delay, tap} from "rxjs/operators";
import {authActions} from "./actions";
import {ajax} from "rxjs/ajax";

import {concat, EMPTY, from, of, pipe} from "rxjs";
import {push} from "connected-react-router";
import {combineEpics} from "redux-observable";
import {api_v1} from "../../api";

export const registerEpic: RootEpic = (action$, state$) => action$.pipe(
    filter(isActionOf(authActions.registration.request)),
    mergeMap(action => ajax.put(api_v1.auth, action.payload, {
        "Content-Type": "application/json"
    })),
    mergeMap(res => {
        if (res.response.result) {
            const id = state$.value.shopInfo.shopInfo.cust_id
            return from([
                authActions.registration.success(res.response),
                push(`/${id}/login`)
            ])
        } else {
            return of(authActions.registration.failure(res.response))
        }
    }),
    catchError(() => of(authActions.registration.failure({result: false, message: 'Произошла ошибка'})))
);

export const loginEpic: RootEpic = (action$, state$) => action$.pipe(
    filter(isActionOf(authActions.login.request)),
    mergeMap(action => ajax.post(api_v1.auth, action.payload, {
        "Content-Type": "application/json"
    }).pipe(
        mergeMap(res => {
                if (res.status === 200) {
                    const redirectPath = state$.value.auth.redirectPath
                    console.log(redirectPath)
                    localStorage.setItem('user_data', JSON.stringify(res.response));
                    return concat(
                        from([authActions.login.success({...res.response, status: true}),
                            authActions.loginFailure.success({result: true, message: 'Вы вошли в систему как пользователь'})
                        ]),

                        !state$.value.auth?.auth.accessToken ? of(push(redirectPath)).pipe(delay(2000)) : EMPTY
                    )
                } else {
                    return from([authActions.login.failure(),
                        authActions.loginFailure.failure(res.response)
                    ])
                }
            }
        ),
        catchError((err) => from([
            authActions.login.failure(),
            authActions.loginFailure.failure({message: 'Неверный логин или пароль', result: false})
        ])),
    )),
);

export const authEpics = combineEpics(
    registerEpic,
    loginEpic
);