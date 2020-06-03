import * as React from 'react'
import {FunctionComponent} from "react";
import styles from './headerStyles.module.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons/faUser";
import cart from '../../../assets/images/cart.png'
import logo from '../../../assets/images/logo.png'
import {useWindowSize} from "react-use";
import {faBars} from "@fortawesome/free-solid-svg-icons/faBars";
import {useDispatch, useSelector} from "react-redux";
import {authActions} from "../../../redux/auth/actions";
import {history} from "../../../index";
import {RootStateType} from "../../../redux/root";
import {useParams} from "react-router";


export interface Props{
    setSidebar:(val:boolean)=>void
}

export const Header: FunctionComponent<Props>= (props) => {
    const {width} = useWindowSize();
    const dispatch=useDispatch();
    const userData=useSelector((state:RootStateType)=>state.auth.auth.accessToken);
    const redirectPath=useSelector((state:RootStateType)=>state.auth.redirectPath)
    const {cust_id} = useParams<{cust_id: string}>()
    const goToAddProduct=()=>{
        dispatch(authActions.loginRedirectPath.request(`/${cust_id}/addProduct`));
        userData.length?history.push(`/${cust_id}/addProduct`):history.push(`/${cust_id}/login`)
    };

    const goToLk=()=>{
        dispatch(authActions.loginRedirectPath.request(`/${cust_id}/personalClient`))
        userData.length?history.push(`/${cust_id}/personalClient`):history.push(`/${cust_id}/login`)
    };
    console.log(userData,'usrData')
    return (
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
                                     <span className={styles.userIconWrapper}>
                            <FontAwesomeIcon icon={faUser} color={'white'}/>
                       </span>
                            <span className={styles.lk} onClick={()=>goToLk()}>
                            Личный кабинет
                            </span>
                    </div>
                    }
                    {width>1068&&
                    <button onClick={()=>goToAddProduct()}>Подать объявление</button>
                    }

                    {width>1086?
                        <div className={styles.cart_block} onClick={()=>history.push(`/${cust_id}/order`)}>
                            <img src={cart} className={styles.cart}/>
                            {width>1068&&
                            <div className={styles.cart_description}>
                                <div>
                            <span>
                                Сумма товаров:
                            </span>
                                    <span>
                                0 руб.
                            </span>
                                </div>
                                <div>
                            <span>
                               Количество товаров:
                            </span>
                                    <span>
                                0 шт.
                            </span>
                                </div>
                            </div>
                            }
                        </div>:
                        <img src={cart} style={{width:'26px',height:'26px'}}/>
                    }


                </div>
            </div>
        </div>
    )
}