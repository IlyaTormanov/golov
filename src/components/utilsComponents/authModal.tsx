import * as React from 'react'
import {FunctionComponent, ReactNode} from "react";
import styles from './authModalStyles.module.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes";
import {history} from "../../index";
import {useParams} from "react-router";


export interface AuthModalProps{
    headerText:string,
    buttonText:string,
    form:ReactNode,
    links?:ReactNode,
    onClick:()=>void,
    additionalLinks?:ReactNode,
    status:{text:string,status:boolean}
}

export const AuthModal:FunctionComponent<AuthModalProps>=(props)=>{
    const {cust_id} = useParams<{cust_id: string}>()
    return(
        <div className={styles.modal_container}>
            <FontAwesomeIcon icon={faTimes} color={'white'}  className={styles.close} onClick={()=>history.push(`/${cust_id}`)}/>

                <div className={styles.modal_content}>
                    <h2 className={styles.modal_content_header}>
                        {props.headerText}
                    </h2>
                    {props.status.text&&
                    <div className={!props.status.status?styles.error:styles.success}>
                        {props.status.text}
                    </div>
                    }
                    {props.form}
                    <button className={styles.button} onClick={props.onClick}>{props.buttonText}</button>
                    {props.additionalLinks}
                </div>
        </div>
    )
};