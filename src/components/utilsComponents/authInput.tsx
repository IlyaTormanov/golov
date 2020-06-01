import * as React from 'react'
import {FunctionComponent} from "react";
import styles from './authInputStyles.module.scss'
export interface Props{
    placeholder?:string,
   typePass?:'password'
    onChange:(value:string)=>void,
    value:string
}

export const AuthInput:FunctionComponent<Props>=(props)=>{
    return(
        <input className={styles.input}
               type={!props.typePass?'text':props.typePass}
               placeholder={props.placeholder}
               onChange={(event)=>props.onChange(event.target.value)}
               value={props.value}
        />
    )
};