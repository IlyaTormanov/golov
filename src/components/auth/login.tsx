import * as React from 'react'
import {FunctionComponent, useCallback, useState} from 'react'
import {AuthModal} from "../utilsComponents/authModal";
import {AuthInput} from "../utilsComponents/authInput";
import {authActions, LoginRequest} from "../../redux/auth/actions";
import {prepareEntity} from "../../utilsF/utils";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../redux/root";
import {Link} from "react-router-dom";
import {useParams} from "react-router";

export interface Props{

}

export const data:LoginRequest={
    Cust_ID_Main: "", Password: "", UserName: ""

};
export const Login:FunctionComponent<Props>=()=>{
    const {cust_id} = useParams<{cust_id: string}>()

    const dispatch=useDispatch();
    const [submitData,setSubmitData]=useState(data);
    const mergeData=(changes:Partial<LoginRequest>)=>setSubmitData(prepareEntity(changes));
    const submit=useCallback(()=>{
        dispatch(authActions.login.request(submitData))
    },[dispatch,submitData]);
    const response=useSelector((state:RootStateType)=>state.auth.loginFailure);
    return(
        <AuthModal headerText={'Вход для зарегистрированных пользователей'}
                   buttonText={'Войти'}
                   status={{text:response.message,status:response.result}}
                   form={
            <form>
                <AuthInput placeholder={'Ваш моб.телефон'} onChange={value => mergeData({Cust_ID_Main:cust_id,UserName:value})} value={submitData.UserName}/>
                <AuthInput placeholder={'Пароль'} typePass={'password'} onChange={value => mergeData({Password:value})} value={submitData.Password}/>
            </form>
        } onClick={submit} additionalLinks={
            <div style={{display:'flex',flexDirection:'column',marginTop:'12px'}}>
                <Link to={`/${cust_id}/restore`} style={{color:'#189691',textDecoration:'none'}}>
                        Забыли пароль
                </Link>
                <Link to={`/${cust_id}/registration`} style={{color:'#189691',textDecoration:'none',marginTop:'12px'}}>
                        Зарегистрироваться
                </Link>
            </div>
        }/>
    )
}