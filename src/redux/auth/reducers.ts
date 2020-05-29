import {combineReducers} from "redux";
import {createReducer} from "typesafe-actions";
import {authActions, AuthType, LoginSuccess} from "./actions";

export const initSuccess={
   accessToken: "",
   fio: "",
   mainImage: "",
   phone: "",
   role: "",
   userId: "",
   userName: "",
   status:false
}

export const authReducer=combineReducers({
   auth:createReducer<LoginSuccess,AuthType>({
      accessToken: "",
      fio: "",
      mainImage: "",
      phone: "",
      role: "",
      userId: "",
      userName: "",
      status:false
   })

       .handleAction(authActions.login.success,(state,action)=>action.payload),
   loginFailure:createReducer<{result:boolean,message:string},AuthType>({message: "", result: false})
       .handleAction(authActions.loginFailure.success,(state,action)=>action.payload)
     .handleAction(authActions.loginFailure.failure,(state,action)=>action.payload),
   register:createReducer<{result:boolean,message:string},AuthType>({message: "", result: false})
       .handleAction(authActions.registration.success,(state, action)=>action.payload)
       .handleAction(authActions.registration.failure,(state,action)=>action.payload),

   redirectPath:createReducer<string,AuthType>('')
       .handleAction(authActions.loginRedirectPath.request,(state,action)=>action.payload)
       .handleAction(authActions.loginRedirectPath.success,(state,action)=>action.payload)

});