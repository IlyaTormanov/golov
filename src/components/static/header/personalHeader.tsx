import * as React from 'react'
import {FunctionComponent, useState} from "react";
import styles from './headerStyles.module.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons/faBars";
import {useWindowSize} from "react-use";
import logo from "../../../assets/images/logo.png";
import {faUser} from "@fortawesome/free-solid-svg-icons/faUser";
import {history} from "../../../index";
import cart from "../../../assets/images/cart.png";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../../redux/root";
import {authActions} from "../../../redux/auth/actions";
import {useParams} from "react-router";
import {faPowerOff} from "@fortawesome/free-solid-svg-icons/faPowerOff";
import {initSuccess} from "../../../redux/auth/reducers";
export interface Props{
    setSidebar:(val:boolean)=>void
}



export const PersonalHeader:FunctionComponent<Props>=(props)=>{
    const {width} = useWindowSize();
    const userData=useSelector((state:RootStateType)=>state.auth.auth);
    const dispatch=useDispatch();
    const {cust_id} = useParams<{cust_id: string}>();
    const [openPopover,setOpenPopover]=useState(false);
    const goToAddProduct=()=>{
        dispatch(authActions.loginRedirectPath.request(`/${cust_id}/addProduct`));
        userData.accessToken.length?history.push(`/${cust_id}/addProduct`):history.push(`/${cust_id}/login`)
    };
    return(
        <div className={styles.header}>
            <div className={styles.header_content}>


            {width<1068&&
            <div className={styles.burger}>
                <FontAwesomeIcon icon={faBars} onClick={()=>props.setSidebar(true)}/>
            </div>

            }
            {width<1068?
                <div className={styles.logo_block}>
                    <img src={logo}/>
                    <span style={{paddingLeft:'7px'}}>
                       <div className={styles.welcome_mobile}>
                            <span>
                            Добро пожаловать в
                        </span>
                            <span>
                                портал Головинского района
                            </span>
                       </div>
                    </span>
                </div>:
                <div className={styles.logo_block}>
                    <img src={logo}/>
                    <span style={{
                        margin: '0 109px 0 19px',
                        fontSize: '18px'
                    }}>
                        Портал головинского района
                    </span>
                </div>
            }
            {width>1068&&
            <div className={styles.header_content_list_item}>
                <div className={styles.header_content_list_item_welcome}>
                    Добро пожаловать!
                </div>
            </div>
            }
            <div className={styles.header_content_list_item}>
                {width>1068&&
                <div className={styles.header_content_list_item_cabinet}>

                    <span className={styles.lk} onClick={()=>history.push(`/${cust_id}`)} >
                            Вернуться к каталогу
                            </span>
                </div>
                }
                {width>1068&&
                <div className={styles.helloName} onClick={()=>setOpenPopover(!openPopover)}>
                    <span>Здравствуйте, {userData.userName}</span>
                    {openPopover&&
                    <div className={styles.popover} onClick={()=>{localStorage.removeItem('user_data');
                    dispatch(authActions.login.success(initSuccess));
                    history.push(`/${cust_id}`)}}>
                      <span>
                           <FontAwesomeIcon icon={faPowerOff} style={{paddingRight:'3px'}}/>
                               Выйти
                      </span>
                    </div>
                    }
                </div>
                }
                {width>1068&&
                <button onClick={()=>goToAddProduct()}>Подать объявление</button>
                }




            </div>
            </div>
        </div>
    )
}