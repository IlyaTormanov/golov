import * as React from 'react'
import {FunctionComponent} from "react";
import styles from './sidebarStyles.module.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../../redux/root";
import {faUser} from "@fortawesome/free-solid-svg-icons/faUser";
import {faPowerOff} from "@fortawesome/free-solid-svg-icons/faPowerOff";
import {Link} from "react-router-dom";
import {useParams} from "react-router";
import {authActions} from "../../../redux/auth/actions";
import {initSuccess} from "../../../redux/auth/reducers";
import {history} from "../../../index";


export interface Props{
onClose:(val:boolean)=>void,
    isLk?:boolean
}

export const Sidebar:FunctionComponent<Props>=(props)=>{
    const dispatch=useDispatch();
    const {cust_id} = useParams<{cust_id: string}>()
    const userData=useSelector((state:RootStateType)=>state.auth.auth);
    const logout=()=>{
        props.onClose(false);
        localStorage.removeItem('user_data');
        dispatch(authActions.login.success(initSuccess));
        history.push(`/${cust_id}`)

    };

    const goToCatalog=()=>{
        props.onClose(false);
        history.push(`/${cust_id}`)
    };
    const goToAddProduct=()=>{
        dispatch(authActions.loginRedirectPath.request(`/${cust_id}/addProduct`));
        userData.accessToken.length?history.push(`/${cust_id}/addProduct`):history.push(`/${cust_id}/login`)
    };

    const goToLk=()=>{
        dispatch(authActions.loginRedirectPath.request(`/${cust_id}/personalClient`))
        userData.accessToken.length?history.push(`/${cust_id}/personalClient`):history.push(`/${cust_id}/login`)
    };
    return(
        <div className={styles.sidebar}>
            <div className={styles.close_icon} onClick={()=>props.onClose(false)}>
                <FontAwesomeIcon icon={faTimes} color={'white'} />
            </div>
            <div className={styles.content}>
                {props.isLk?
                    <div className={styles.first_row}>
                        <div onClick={()=>{props.onClose(false);goToAddProduct()}} className={styles.lc}>
                            <span>
                            Подать объявление
                        </span>
                        </div>
                        <div className={styles.add} onClick={()=>{props.onClose(false);goToCatalog()}}> Вернуться к каталогу</div>
                    </div>:
                <div className={styles.first_row}>
                    <div onClick={()=>{props.onClose(false);goToLk()}} className={styles.lc}>
                        <FontAwesomeIcon icon={faUser}/>
                        <span>
                            Личный кабинет
                        </span>
                    </div>
                    <div className={styles.add} onClick={()=>{props.onClose(false);goToAddProduct()}}> Подать объявление</div>
                </div>

                }
                {userData.accessToken&&
                <div className={styles.last_row}>
                    <span className={styles.welcome}>Здравствуйте, {userData.fio}</span>
                    <div>
                        <FontAwesomeIcon icon={faPowerOff}/>
                        <span className={styles.exit} onClick={logout}>Выйти</span>
                    </div>
                </div>
                }
            </div>
        </div>
    )
}