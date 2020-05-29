import * as React from 'react'
import {FunctionComponent, useCallback, useState} from "react";
import {AuthModal} from "../utilsComponents/authModal";
import {AuthInput} from "../utilsComponents/authInput";
import axios from 'axios'
import {history} from "../../index";
import {useParams} from "react-router";
export interface Props{

}

export const Restore:FunctionComponent<Props>=()=>{
    const [phone,setPhone]=useState('');
    const [message,setMessage]=useState<{message:string,result:boolean}>();
    const {cust_id} = useParams<{cust_id: string}>()
    const submit=useCallback(()=>{
        axios.post('http://golowinskiy-api.bostil.ru/api/password',{phone:phone,Cust_ID_main:cust_id},{
            headers:{
                "Content-Type": "application/json"
            }
        }).then(res=>{

            if(res.data.founded===false){
                setMessage(res.data)

            }
            else{
                setMessage(res.data.message)
                history.push('/login')
            }
        })
    },[phone]);
    return(
        <AuthModal headerText={'Заполните номер телефона'}
                    status={{text:message?.result?message?.message:'Неправильный e-mail' ,status:!!message?.result}}
                   buttonText={'Войти'}
                   form={
            <form>
                <AuthInput placeholder={'Ваш мобильный номер'} onChange={value => setPhone(value)}/>

            </form>
        } onClick={submit}/>
    )
}