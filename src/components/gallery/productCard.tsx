import * as React from 'react'
import {FunctionComponent} from "react";
import {Product} from "../../interfaces";
import styles from './ProductCardStyles.module.scss'
import {useSelector} from "react-redux";
import {RootStateType} from "../../redux/root";
import {history} from "../../index";
import {useParams} from "react-router";
import {api_v1} from "../../api";



export interface Props{
    product:Product,
    isLc?:boolean
}
export const ProductCard:FunctionComponent<Props>=(props)=>{
    const {cust_id, gallery_id}=useParams<{cust_id:string, gallery_id: string}>();
    return(
        <div className={styles.product_list_item} onClick={()=>history.push(props.isLc?`/${cust_id}/personalClient/${gallery_id}/${props.product.prc_ID}`:`/${cust_id}/${gallery_id}/${props.product.prc_ID}`)}>
            <div className={styles.avatar_wrapper}>
                <img src={`${api_v1.galleryProduct}?AppCode=${cust_id}&ImgFileName=${props.product.image_Base}`}/>
            </div>
            <div className={styles.product_description}>
                <div className={styles.name}>
                    {props.product.tName}
                </div>
                <div className={styles.price}>
                    {props.product.prc_Br}
                    {props.isLc&&
                    <div>
                        <span>
                            В корзину
                        </span>
                    </div>
                    }
                </div>
            </div>

        </div>
    )
}