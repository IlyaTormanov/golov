import * as React from 'react'
import {FunctionComponent, useCallback, useState} from "react";
import {AuthModal} from "../utilsComponents/authModal";
import {AuthInput} from "../utilsComponents/authInput";
import axios from 'axios'
import {history} from "../../index";
import {useParams} from "react-router";
import {api_v1} from "../../api";

export interface Props{

}

export const Restore:FunctionComponent<Props>=()=>{
    const [phone,setPhone]=useState('');
    const [message,setMessage]=useState<{message:string,result:boolean}>();
    const {cust_id} = useParams<{cust_id: string}>()
    const submit=useCallback(()=>{
        axios.post(api_v1.restore,{phone:phone,Cust_ID_main:cust_id},{
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
                <AuthInput placeholder={'Ваш мобильный номер'} onChange={value => setPhone(value)} value={phone}/>

            </form>
        } onClick={submit}/>
    )
}