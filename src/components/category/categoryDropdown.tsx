import * as React from 'react'
import {FunctionComponent, useEffect} from "react";
import styles from './categoryStyles.module.scss'
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../redux/root";
import {Category} from "../../interfaces";
import {Item} from "./item";
import {categoriesAction} from "../../redux/categories/actions";
import {ClipLoader} from "react-spinners";
import {useParams} from "react-router";



export interface Props{
    onClick:(params: {
        path: Category[],
        isOpen: boolean,
        isLast: boolean,
    })=>void,
    path:Category[],
    isCid?:string
    minHeight?:string
    isAdvert?:boolean
    setLastItem?:(value:string,id:string)=>void
}

export const CategoryDropdown: FunctionComponent<Props> = (props) => {
    const categoryList = useSelector((state: RootStateType) => state.categories.categories);
    const dispatch=useDispatch();
    const {cust_id}=useParams<{cust_id:string}>();
    useEffect(()=>{
        dispatch(categoriesAction.fetchAllCategory.request({
            cust_ID_Main: cust_id,
            advert:props.isAdvert?'1':'',
            cid:props.isCid?props.isCid:''
        }))
    },[dispatch, cust_id])
    const categoriesMenu = document.getElementById('categories_menu');
    const menus = categoriesMenu?.querySelectorAll('ul');
    let height = 0;
    if (categoriesMenu && menus) {
        for (let i = 0; i < menus.length; i++) {
            let client = menus[i].clientTop + menus[i].clientHeight;
            if (client > height) {
                height = client
            }
        }
    }

    return(
       <div className={styles.list}>
           <div className={styles.inner} style={{minHeight:props.minHeight?props.minHeight:'calc(-232px + 100vh)'}}>

               <div className={styles.left_menu} id={'categories_menu'}>
                   <div className={styles.header_block}>
                       <h5 className={styles.header}>Выберите раздел каталога</h5>
                       {!categoryList.length&&
                       <ClipLoader
                           size={18}
                           color={"black"}

                       />
                       }
                   </div>
                   <ul className={styles.wrap_ul}>
                       {
                           categoryList.map(data => <Item
                               key={data.id}
                               data={data}
                               path={props.path}
                               onClick={props.onClick}
                           />)
                       }
                   </ul>

               </div>

           </div>
       </div>
    )

};