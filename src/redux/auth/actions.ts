import {ActionType, createAction, createAsyncAction} from "typesafe-actions";

export interface RegisterRequest{
    Cust_ID_Main:string
    e_mail:string
    f:string
    Mobile:string
    password:string
    Phone1:string
}


export interface LoginRequest{
    Cust_ID_Main:string
    Password:string
    UserName:string
}

export interface LoginSuccess{
    accessToken:string,
    userName:string
    role:string
    userId:string
    fio:string
    phone:string
    mainImage:string,
    status:boolean
}

export const authActions={
    registration:createAsyncAction(
        '@AUTH/REGISTER_USER_REQUEST',
        '@AUTH/REGISTER_USER_SUCCESS',
        '@AUTH/REGISTER_USER_FAILURE',
    )<RegisterRequest,{result:boolean,message:string},{result:boolean,message:string}>(),
    login:createAsyncAction(
        '@AUTH/LOGIN_USER_REQUEST',
        '@AUTH/LOGIN_USER_SUCCESS',
        '@AUTH/LOGIN_USER_FAILURE',
    )<LoginRequest,LoginSuccess,undefined>(),
    loginFailure:createAsyncAction(
        '@AUTH/LOGIN_ERROR_REQUEST',
        '@AUTH/LOGIN_ERROR_SUCCESS',
        '@AUTH/LOGIN_ERROR_FAILURE',
    )<undefined,{result:boolean,message:string},{result:boolean,message:string}>(),
    loginRedirectPath:createAsyncAction(
        '@AUTH_PATH/REDIRECT_PATH_REQUEST',
        '@AUTH_PATH/REDIRECT_PATH_SUCCESS',
        '@AUTH_PATH/REDIRECT_PATH',
    )<string,string,undefined>()
};
export type AuthType=ActionType<typeof authActions>