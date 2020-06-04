import * as React from 'react'
import {FunctionComponent} from "react";
import styles from './breadcrumbsStyle.module.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleRight} from "@fortawesome/free-solid-svg-icons/faAngleRight";
import {Category} from "../../interfaces";
import {pipe} from "fp-ts/es6/pipeable";
import {useDispatch} from "react-redux";
import {galleryActions} from "../../redux/gallery/actions";
import {shopInfoAction} from "../../redux/shopInfo/actions";

export interface Props {
    crumbs_list: Category,
    onClick: (path: Category[]) => void,

}

export const Breadcrumbs: FunctionComponent<Props> = (props) => {

    return (
        <div className={styles.breadcrumbs_list_item} onClick={() => props.onClick([props.crumbs_list])}>
            {props.crumbs_list.txt}
            <FontAwesomeIcon icon={faAngleRight}/>
        </div>
    )
}