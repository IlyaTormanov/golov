import * as React from "react";
import {FunctionComponent, useCallback, useEffect, useMemo, useState} from "react";
import styles from './productStyles.module.scss'
import {useParams} from "react-router";
import {galleryActions} from "../../redux/gallery/actions";
import {batch, useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../redux/root";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes";
import {history} from "../../index";
import phone from '../../assets/images/phone.png'
import email from '../../assets/images/email.png'
import app2 from '../../assets/images/app2.png'
import app1 from '../../assets/images/app1.png'
import axios from 'axios'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import cart from '../../assets/images/white-cart.png'
import {useWindowSize} from "react-use";
import {ClipLoader} from "react-spinners";
import './product.css'
import {faCheck} from "@fortawesome/free-solid-svg-icons/faCheck";
import {findIndex, lookup} from "fp-ts/es6/Array";
import {chain, isSome} from "fp-ts/es6/Option";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons/faChevronRight";

export interface ProductProps {
}

export interface AddToOrderType {
    Ctlg_Name: string
    Ctlg_No: string
    Descr: string
    OI_No: number
    OrdTtl_Id: number
    Qty: number
    Sup_ID: number
}

const addToOrderData: AddToOrderType = {
    Ctlg_Name: "",
    Ctlg_No: "",
    Descr: "",
    OI_No: 0,
    OrdTtl_Id: 0,
    Qty: 0,
    Sup_ID: 0
};

export type StorageItem = {
    id: 21669
    name: string
    price: string
    ctlg_No: string
    ctlg_Name: string
    sup_ID: string
}

export interface Props {
}

const useQuery = () => {
    const {width} = useWindowSize();
    return {
        isMobile: width <= 1086,
        isDesktop: width > 1086
    }
};


export const Product: FunctionComponent<Props> = (props) => {
    const dispatch = useDispatch();
    const preloader = useSelector((state: RootStateType) => state.gallery.productPreloader);
    const productList = useSelector((state: RootStateType) => state.gallery.gallery.res);

    const {cust_id, product_id, gallery_id} = useParams<{ cust_id: string, product_id: string, gallery_id: string }>();
    const {isMobile, isDesktop} = useQuery();

    useEffect(() => {
        batch(() => {
            dispatch(galleryActions.fetchGalleryProduct.request({
                appCode: cust_id,
                cust_ID: cust_id,
                prc_ID: product_id
            }))
        })
    }, [cust_id, product_id]);

    const orderList = localStorage.getItem('orderList');
    if (orderList != null) {
        JSON.parse(orderList)
    }

    const productData = useSelector((state: RootStateType) => state.gallery.galleryProduct);
    const [orderStatus, setOrderStatus] = useState(false);
    const toOrder = useCallback(() => {
        axios.get(`http://golowinskiy-api.bostil.ru/api/Load/${cust_id}`).then(res => {
            axios.post('http://golowinskiy-api.bostil.ru/api/order/', {Cust_ID: res.data}).then(response => {
                axios.post('http://golowinskiy-api.bostil.ru/api/addtocart', {
                    OrdTtl_Id: response.data.ord_ID,
                    OI_No: 1,
                    Ctlg_No: productData.ctlg_No,
                    Qty: 1,
                    Ctlg_Name: productData.ctlg_Name,
                    Sup_ID: productData.sup_ID,
                    Descr: productData.tName,
                }).then(r => {
                    if (r.data.result === true) {
                        setOrderStatus(r.data.result);
                        localStorage.setItem('orderList', JSON.stringify([orderList, {
                            OrdTtl_Id: response.data.ord_ID,
                            OI_No: 1,
                            Ctlg_No: productData.ctlg_No,
                            Qty: 1,
                            Ctlg_Name: productData.ctlg_Name,
                            Sup_ID: productData.sup_ID,
                            Descr: productData.tName,
                            price: productData.prc_ID
                        }]))
                    }
                })
            })
        })
    }, [cust_id, productData]);

    const [currentImg, setCurrentImg] = useState('')
    const {prev, next} = useMemo(() => {
        const links = productList.map(link => link.prc_ID.toString());
        const index = findIndex(item => item === product_id)(links);
        return {
            prev: chain((index: number) => lookup(index - 1, links))(index),
            next: chain((index: number) => lookup(index + 1, links))(index),
        }
    }, [productList, product_id]);
    return (
        <div className={styles.detail_wrapper}>
            <div className={`${styles.detail_product} ${productData.additionalImages?.length ? '' : styles.empty}`}>
                <div className={styles.close_icon} onClick={() => history.push(`/${cust_id}/${gallery_id}`)}>
                    <FontAwesomeIcon
                        icon={faTimes}
                        color={'white'}
                        style={{
                            width: '25px',
                            height: '25px',
                            color: '#95c6c3'
                        }}
                    />
                </div>
                {isSome(prev) &&
                <FontAwesomeIcon
                    className={styles.left}
                    onClick={() => history.push(prev.value)}
                    icon={faChevronLeft}
                    style={{
                        width: '30px',
                        height: '30px'
                    }}
                />
                }
                {isSome(next) &&
                <FontAwesomeIcon
                    className={styles.right}
                    onClick={() => history.push(next.value)}
                    icon={faChevronRight}
                    style={{width: '30px', height: '30px'}}
                />
                }
                <div className={styles.image}>
                    {preloader ?
                        <ClipLoader
                            size={36}
                            color={"white"}
                        />
                        :
                        <img
                            src={`http://golowinskiy-api.bostil.ru/api/Img?AppCode=${cust_id}&ImgFileName=${currentImg ? currentImg : productData.t_imageprev}`}/>
                    }
                </div>
                {(isMobile && productData.additionalImages) &&
                <div className={styles.additional}>
                    {productData.additionalImages?.map(img =>
                        <img
                            src={`http://golowinskiy-api.bostil.ru/api/Img?AppCode=${cust_id}&ImgFileName=${img.t_image}`}
                            onMouseEnter={() => setCurrentImg(img.t_image)}
                            onMouseLeave={() => setCurrentImg('')}
                        />
                    )}
                </div>
                }
                <div className={styles.info}>
                    <div className={styles.detail_product_item_info_price}>
                        <h4>
                            {productData.tName}
                        </h4>
                        <p className={styles.price}>
                            {productData.prc_Br}
                        </p>
                    </div>
                    <div className={styles.button_wrapper}>
                        <div className={styles.to_cart} onClick={() => toOrder()}
                             style={{background: orderStatus ? '#37c509' : ' background: #f1173a;'}}>
                            {orderStatus ? <FontAwesomeIcon icon={faCheck} color={'white'}/> : <img src={cart}/>}
                            <span>{orderStatus ? 'В корзине' : 'В корзину'}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.aside}>
                    {isDesktop &&
                    <h4>
                        {productData.tName}
                    </h4>
                    }
                    <p>
                        {productData.catalog}
                    </p>
                    {
                        isDesktop && <div className={styles.additional}>
                            {productData.additionalImages?.map(img =>
                                <img
                                    src={`http://golowinskiy-api.bostil.ru/api/Img?AppCode=${cust_id}&ImgFileName=${img.t_image}`}
                                    onMouseEnter={() => setCurrentImg(img.t_image)}
                                    onMouseLeave={() => setCurrentImg('')}
                                />
                            )}
                        </div>
                    }
                    {productData.tDescription &&
                    <div className={styles.description}>
                        {productData.tDescription}
                    </div>
                    }
                    <div className={styles.contact_info}>
                        <div className={styles.phone}>
                            <img src={phone}/>
                            <span>
                        8-916-1616146
                    </span>
                        </div>
                        <div className={styles.email}>
                            <img src={email}/>
                            <span>golovinskiy-rf@mail.ru</span>
                        </div>
                    </div>
                    <div className={styles.application}>
                        <img src={app2}/>
                        <img src={app1}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
