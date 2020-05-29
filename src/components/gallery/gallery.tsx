import * as React from 'react'
import {FunctionComponent, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../redux/root";
import {ProductCard} from "./productCard";
import styles from './galleryStyles.module.scss'
import {galleryActions} from "../../redux/gallery/actions";
import {useParams} from "react-router";
import {Breadcrumbs} from "./breadcrumbs";
import {Category} from "../../interfaces";
import {history} from "../../index";
import {useWindowSize} from "react-use";
import {CategoryDropdownMobile} from "../category/categoryDropdownMobile";
import {ClipLoader} from "react-spinners";
import {pipe} from "fp-ts/es6/pipeable";
import {init} from "fp-ts/es6/Array";
import {getOrElse} from "fp-ts/es6/Option";
import Pagination from 'rc-pagination';
import './gallery.css'
import {push} from "connected-react-router";

export interface GalleryProps {
    path: Category[],
    onClick: (index: number) => void,
    secondClick: (path: Category[]) => void
}

export const Gallery: FunctionComponent<GalleryProps> = (props) => {
    // const cust_id=useSelector((state:RootStateType)=>state.shopInfo.shopInfo.cust_id);
    const products = useSelector((state: RootStateType) => state.gallery.gallery);
    const preloader = useSelector((state: RootStateType) => state.gallery.galleryPreloader)
    const {cust_id, gallery_id} = useParams<{ gallery_id: string, cust_id: string }>();
    const dispatch = useDispatch();
    const {width} = useWindowSize();


    const currentPage = useSelector((state: RootStateType) => state.gallery.paginate)
    useEffect(() => {
        dispatch(galleryActions.fetchGallery.request({
            data: {CID: '', ID: gallery_id, Cust_ID: cust_id},
            paginateInfo: {PageNumber: currentPage, CountOnPage: 15}
        }))
        dispatch(galleryActions.galleryPreloader.success(true))
    }, [dispatch, gallery_id, cust_id]);
    console.log(products.pageInfoOutput.totalPages)
    return (
        <div className={styles.product_list} style={{maxWidth: preloader ? '100%' : '1200px'}}>
            {preloader ?

                <div className={styles.preloader}>
                    <ClipLoader size={36}
                                color={"black"}/>
                </div>
                :

                <div className={styles.breadcrumbs_list}
                     style={{width: width < 1068 ? '100%' : 'auto', paddingLeft: width < 1068 ? '0' : '9px'}}>
                    {width > 1068 ?
                        props.path.map((crumb, index) =>
                            <Breadcrumbs
                                key={index}
                                crumbs_list={crumb}
                                onClick={() => {
                                    props.onClick(index);
                                    dispatch(push('/' + cust_id));
                                }}
                            />
                        )
                        :
                        <CategoryDropdownMobile onClick={params => {
                            props.secondClick(params.isOpen ? pipe(params.path, init, getOrElse<Category[]>(() => [])) : params.path)
                            if (params.isLast) {
                                history.push(`/${cust_id}/${params.path[params.path.length - 1].id}`)
                            }
                        }}
                                                path={props.path}/>
                    }


                </div>
            }
            <div className={styles.products}>
                {products.res.map((product, index) =>
                    <ProductCard product={product} key={index}/>
                )}
            </div>
            <Pagination className={styles.pagination} current={currentPage}
                        total={products.pageInfoOutput.totalPages * products.pageInfoOutput.countOnPage}
                        pageSize={products.pageInfoOutput.countOnPage}
                        onChange={(page, pageSize) => {
                            dispatch(galleryActions.fetchGallery.request({
                                data: {
                                    CID: '',
                                    ID: gallery_id,
                                    Cust_ID: cust_id
                                }
                                , paginateInfo: {PageNumber: page, CountOnPage: pageSize}
                            }));

                        }}/>
        </div>
    )
}