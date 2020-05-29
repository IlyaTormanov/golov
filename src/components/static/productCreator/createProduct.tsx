import * as React from 'react'
import {FunctionComponent, useCallback, useEffect, useRef, useState} from "react";
import styles from './createProductStyles.module.scss'
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../../redux/root";
import {AuthInput} from "../../utilsComponents/authInput";
import {AddProduct, Category} from "../../../interfaces";
import {prepareEntity} from "../../../utilsF/utils";
import {productActions} from "../../../redux/product/actions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUpload} from "@fortawesome/free-solid-svg-icons/faUpload";
import {CategoryDropdown} from "../../category/categoryDropdown";
import axios from 'axios'

import {Link} from "react-router-dom";
import {useWindowSize} from "react-use";
import {CategoryDropdownMobile} from "../../category/categoryDropdownMobile";
import {useParams} from "react-router";
import {history} from "../../../index";
import {prepareToFormData} from "../../../redux/product/epics";
import {pipe} from "fp-ts/es6/pipeable";
import {chain, fromNullable, getOrElse, map} from "fp-ts/es6/Option";
import {init} from "fp-ts/es6/Array";
import {ClipLoader} from "react-spinners";

const append = <T extends any>(item: T) => (array: T[]) => [...array, item];

const getUrl = (file: File) => {
    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
        reader.onload = (event) => {
            event.target && resolve(event.target.result as string);
        };
        reader.readAsDataURL(file)
    })
};

export interface Props {

}

export const data: AddProduct = {
    Appcode: "",
    CID: "",
    Catalog: "",
    Ctlg_Name: "",
    Id: "",
    PrcNt: "",
    TArticle: "",
    TCost: "",
    TDescription: "",
    TImageprev: "",
    TName: "",
    TransformMech: "",
    TypeProd: "",
    video: ""

};

export const CreateProduct: FunctionComponent<Props> = () => {
    const userData = useSelector((state: RootStateType) => state.auth.auth);
    const {cust_id} = useParams<{ cust_id: string }>()
    const {width} = useWindowSize();
    const dispatch = useDispatch();
    const [path, setPath] = useState<Category[]>([]);
    const [productData, setProductData] = useState(data);
    const mergeData = (changes: Partial<AddProduct>) => setProductData(prepareEntity(changes));
    const main_image = useRef<HTMLImageElement>(null);
    const [validate, setValidate] = useState(false);
    const [images, setImages] = useState<{preview: string, name: string}[]>([]);
    const additional_image = useRef<HTMLImageElement>(null);
    const requestState = useSelector((state: RootStateType) => state.product.productSuccess.status);
    console.log( requestState,'rs')
    const main_image_form_data = new FormData();
    main_image_form_data.append('AppCode', cust_id);
    const add_image_form_data = new FormData();
    add_image_form_data.append('appcode', cust_id);
    const addMainImage = useCallback(() => {
        axios.post('http://golowinskiy-api.bostil.ru/api/img/upload/', main_image_form_data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(res =>
            console.log(res.data)
        )
    }, [main_image_form_data]);

    const createProduct = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch(productActions.addProductPreloader.request(false))
        dispatch(productActions.addProduct.request({product: productData, images: images.map(image => image.name)}))

    };

    const preloader=useSelector((state:RootStateType)=>state.product.isAdd)
    console.log(preloader,'preloader')
    const uploadImage = useCallback((img: File) => axios.post(
        'http://golowinskiy-api.bostil.ru/api/img/upload/',
        prepareToFormData({
            'AppCode': cust_id,
            'Img': img,
            'TImageprev': img.name,
        }),
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }), [add_image_form_data]
    );
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>
                Разместить объявление
            </h3>
            <div className={styles.md_center}>
                <div>
                    <Link to={`/${cust_id}`} style={{textDecoration: 'none'}}>
                        Вернуться к каталогу
                    </Link>
                </div>

            </div>
            <div className={styles.md_center}>
                <div>
                    <Link to={`/${cust_id}/personalClient`}>
                        Вернуться в личный кабинет
                    </Link>
                </div>
            </div>
            <div className={styles.info_first}>
                <div className={styles.info_second}>
                    <div className={styles.info_container}>

                        <h5>
                            Контактная информация
                        </h5>
                        <div>
                            {userData.fio}
                        </div>
                        <div>
                            {userData.phone}
                        </div>
                        <div>
                            {userData.phone}
                        </div>
                    </div>

                </div>

            </div>
            <div className={styles.select_category}>
                {width < 1068 ?
                    <CategoryDropdownMobile onClick={params => {
                        setPath(params.isOpen? pipe(params.path, init, getOrElse<Category[]>(() => [])): params.path)
                        if (params.isLast) {
                            mergeData({
                                Ctlg_Name: params.path[params.path.length - 1].txt,
                                Id: params.path[params.path.length - 1].id
                            })
                        }
                    }
                    }
                                            path={path}
                                            isAdvert={true}
                    />
                    :
                    <CategoryDropdown onClick={params => {
                        setPath(params.isOpen? pipe(params.path, init, getOrElse<Category[]>(() => [])): params.path)
                        if (params.isLast) {
                            mergeData({
                                Ctlg_Name: params.path[params.path.length - 1].txt,
                                Id: params.path[params.path.length - 1].id
                            })
                        }

                    }} minHeight={'530px'} isAdvert={true}
                                      path={path}
                    />
                }
            </div>
            <div className={styles.form_wrapper_div}>
                <form>
                    <div className={styles.item}>
                        <div className={styles.label_wrapper}>
                            <label>
                                Наименование товара,услуги *
                            </label>
                        </div>
                        <div className={styles.form_wrapper}>
                            <AuthInput onChange={value => {
                                mergeData({TName: value, CID: userData.userId, Appcode: cust_id, Catalog: cust_id});
                                !value.length ? setValidate(true) : setValidate(false);
                            }}/>
                            {validate &&
                            <p className={styles.validate}>Заполните наименование товара,услуги</p>
                            }
                        </div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.label_wrapper}>
                            <label>
                                Основная фотография
                            </label>
                        </div>
                        <div className={styles.form_wrapper}>

                            <div className={styles.image}>
                                <input type={'file'} className={styles.upload_input} onChange={event => {
                                    pipe(
                                        fromNullable(event.target.files),
                                        chain(list => fromNullable(list[0])),
                                        map(file => {
                                            getUrl(file).then(name => main_image.current?.setAttribute('src', name));
                                            uploadImage(file).then(() => mergeData({'TImageprev':file.name}));
                                        })
                                    );
                                }}/>
                                <img ref={main_image}/>
                                <FontAwesomeIcon icon={faUpload}/>
                            </div>
                        </div>
                    </div>

                    <div className={styles.loading}>

                        {requestState!==0&&
                        <div className={styles.loading_text}>
                            {!preloader&&
                            <ClipLoader size={22}
                                        color={"black"}/>
                            }
                            {
                                (requestState&&requestState!==200)?
                                    <div>
                                        Ошибка
                                    </div>:
                                    <div>Товар успешно добавлен в корзину!</div>

                            }
                        </div>
                        }
                    </div>

                    <div className={styles.item}>
                        <div className={styles.label_wrapper}>
                            <label>
                                Дополнительная фотография
                            </label>
                        </div>

                        <div className={styles.form_wrapper}>
                            {
                                images.map(image => <div className={styles.image}>
                                    <img src={image.preview} alt={image.name}/>
                                    <FontAwesomeIcon icon={faUpload}/>
                                </div>)
                            }

                            <div className={styles.image}>
                                <input type={'file'} className={styles.upload_input} onChange={event => {
                                    pipe(
                                        fromNullable(event.target.files),
                                        chain(list => fromNullable(list[0])),
                                        map(file => {
                                            uploadImage(file).then(() => getUrl(file).then(preview => {
                                                setImages(append({
                                                    preview,
                                                    name: file.name,
                                                }))
                                            }))
                                        })
                                    );
                                }}/>
                                <img src={''} ref={additional_image}/>
                                <FontAwesomeIcon icon={faUpload}/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.label_wrapper}>
                            <label>
                                Описание товара,услуги
                            </label>
                        </div>
                        <div className={styles.form_wrapper}>
                                <textarea onChange={event => mergeData({TDescription: event.target.value})}>

                            </textarea>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.label_wrapper}>
                            <label>
                                Цена
                            </label>
                        </div>
                        <div className={styles.form_wrapper}>
                            <AuthInput onChange={value => mergeData({TCost: value})}/>
                        </div>
                    </div>
                    <div className={styles.submitBlock}>
                        <button className={styles.button}
                                onClick={(e) => createProduct(e)}
                                disabled={productData.TName.length < 3}>Разместить объявление
                        </button>
                    </div>
                    <div className={styles.row_other}>
                        <div>
                            <p>
                                Необязательные поля
                            </p>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.label_wrapper}>
                            <label>
                                Ссылка на видео
                            </label>
                        </div>
                        <div className={styles.form_wrapper}>
                            <AuthInput onChange={value => mergeData({video: value})}/>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.label_wrapper}>
                            <label>
                                Тип изделия
                            </label>
                        </div>
                        <div className={styles.form_wrapper}>
                            <AuthInput onChange={value => mergeData({TypeProd: value})}/>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.label_wrapper}>
                            <label>
                                Конечная цена изделия в рублях
                            </label>
                        </div>
                        <div className={styles.form_wrapper}>
                            <AuthInput onChange={value => mergeData({PrcNt: value})}/>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.label_wrapper}>
                            <label>
                                Артикул товара
                            </label>
                        </div>
                        <div className={styles.form_wrapper}>
                            <AuthInput onChange={value => mergeData({TArticle: value})}/>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.label_wrapper}>
                            <label>
                                Механизм трансформации
                            </label>
                        </div>
                        <div className={styles.form_wrapper}>
                            <AuthInput onChange={value => mergeData({TransformMech: value})}/>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    )
}