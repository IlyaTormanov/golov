import * as React from 'react'
import {FunctionComponent} from "react";
import styles from './OrderStyles.module.scss'
import {StorageItem} from "../category/Product";
export interface OrderProps{

}

const isArr=(arg:any):arg is StorageItem[]=>{
    return arg.length!==0
};

const check=(arg:StorageItem[]|string|undefined)=>{
    if(isArr(arg)){
        return arg
    }
    else{
        return ''
    }
}
const orderList= localStorage.getItem('orderlist')
if (orderList != null) {
    check(JSON.parse(orderList))
}
export const Order:FunctionComponent<OrderProps>=()=>{



    return(
        <div className={styles.order}>
                <div>
                    <h2 className={styles.title}>
                        Корзина
                    </h2>
                    <form >
                        <div className={styles.item_title}>
                            <div className={styles.item}>Название</div>
                            <div className={styles.item}>Количество</div>
                            <div className={styles.item}>Цена</div>

                        </div>
                        <div className={styles.item_list}>
                            {orderList!==null&&
                            check(JSON.parse(orderList).map((item: StorageItem)=>
                                <div className={styles.order}>
                                    {item.ctlg_Name}
                                </div>
                            ))
                            }
                        </div>
                    </form>
                </div>
        </div>
    )
}