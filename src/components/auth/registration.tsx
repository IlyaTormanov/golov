import * as React from 'react'
import {FunctionComponent, useEffect, useState} from "react";
import {AuthModal} from "../utilsComponents/authModal";
import {AuthInput} from "../utilsComponents/authInput";
import {authActions, RegisterRequest} from "../../redux/auth/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../redux/root";
import {prepareEntity} from "../../utilsF/utils";
import {Link} from "react-router-dom";
import {useParams} from "react-router";

export interface Props{


}


export  const registerData:RegisterRequest={
    Cust_ID_Main: "",
    Mobile: "",
    Phone1: "",
    e_mail: "",
    f: "",
    password: ""

};

export const Registration:FunctionComponent<Props>=()=>{

    const {cust_id} = useParams<{cust_id: string}>()
    const dispatch=useDispatch();

    const response=useSelector((state:RootStateType)=>state.auth.register)
    const [data,setData]=useState(registerData);
    const mergeData=(changes:Partial<RegisterRequest>)=>setData(prepareEntity(changes));
console.log(response)
    return(

        <AuthModal headerText={'Регистрация'}
                   status={{text:response.message,status:response.result}}
                   onClick={()=>dispatch(authActions.registration.request(data))}
                   buttonText={'Зарегистрироваться'} form={
            <form>
                <AuthInput placeholder={'Ваше имя'} onChange={value => mergeData({f:value,Cust_ID_Main:cust_id})}/>
                <AuthInput placeholder={'Ваш email'} onChange={value => mergeData({e_mail:value})}/>
                <AuthInput placeholder={'Ваш стационарный номер'} onChange={value => mergeData({Phone1:value})}/>
                <AuthInput placeholder={'Ваш мобильный номер'} onChange={value => mergeData({Mobile:value})}/>
                <AuthInput placeholder={'Пароль '} typePass={'password'} onChange={value => mergeData({password:value})}/>
            </form>
                   } additionalLinks={
            <div style={{display:'flex',flexDirection:'column'}}>
                <Link to={`/${cust_id}/restore`} style={{color:'#189691',textDecoration:'none'}}>
                    Забыли пароль
                </Link>
                <Link to={`/${cust_id}/login`} style={{color:'#189691',textDecoration:'none',marginTop:'12px'}}>
                    Войти
                </Link>
            </div>
        }/>
    )
}