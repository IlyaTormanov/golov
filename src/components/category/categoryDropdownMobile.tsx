import * as React from 'react'
import {FunctionComponent} from "react";
import {Category} from "../../interfaces";
import styles from './categoryMobileStyles.module.scss'
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../redux/root";
import {MobileItem} from "./mobileItem";
import {useParams} from "react-router";
import {useEffect} from "react";
import {categoriesAction} from "../../redux/categories/actions";
export interface Props{
    onClick:(params: {
        path: Category[],
        isOpen: boolean,
        isLast: boolean,
    })=>void,
    path:Category[],
    isAdvert?:boolean,
    isCid?:string
}

export const CategoryDropdownMobile:FunctionComponent<Props>=(props)=>{
    const categoryList = useSelector((state: RootStateType) => state.categories.categories);
    const {cust_id}=useParams<{cust_id:string}>();
    const dispatch=useDispatch();
    useEffect(()=>{
        dispatch(categoriesAction.fetchAllCategory.request({
            cust_ID_Main: cust_id,
            advert:props.isAdvert?'1':'',
            cid:props.isCid?props.isCid:''
        }))
    },[dispatch, cust_id])
    return(
        <div className={styles.inner}>

            <div className={styles.left_menu} id={'categories_menu'}>
                <h5 className={styles.header}>Выберите раздел каталога</h5>

                <ul className={styles.wrap_ul_mobile}>
                    {
                        categoryList.map(data => <MobileItem
                            key={data.id}
                            data={data}
                            path={props.path}

                            onClick={props.onClick}/>
                        )
                    }
                </ul>
            </div>

        </div>
    )
}