import * as React from 'react'
import {FunctionComponent} from "react";
import styles from './footerStyles.module.scss'


export const Footer:FunctionComponent=()=>{
    return(
        <div className={styles.footer}>
            <div className={styles.content}>

                <div className={styles.footer_list_left}>
                        <p>Головинский район</p>
                    <p>г.Москва, ул.Смольная, 7</p>
                </div>
                <div className={styles.footer_list_right}>
                    <p>
                        8 (916) 161 61 46
                    </p>
                    <p>
                        golovinskiy-rf@mail.ru
                    </p>
                </div>
            </div>
        </div>
    )
}