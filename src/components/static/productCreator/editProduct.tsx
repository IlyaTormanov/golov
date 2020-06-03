import * as React from 'react'
import {FunctionComponent, useCallback, useMemo} from "react";
import styles from "./createProductStyles.module.scss";
import {Link} from "react-router-dom";
import {CategoryDropdownMobile} from "../../category/categoryDropdownMobile";
import {pipe} from "fp-ts/es6/pipeable";
import {init} from "fp-ts/es6/Array";
import {chain, fromNullable, getOrElse, map} from "fp-ts/es6/Option";
import {AddProduct, Category} from "../../../interfaces";
import {CategoryDropdown} from "../../category/categoryDropdown";
import {AuthInput} from "../../utilsComponents/authInput";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes";
import {faUpload} from "@fortawesome/free-solid-svg-icons/faUpload";
import {ClipLoader} from "react-spinners";
import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../../redux/root";
import {useParams} from "react-router";
import {useState} from "react";
import {useWindowSize} from "react-use";
import {prepareEntity} from "../../../utilsF/utils";
import {useRef} from "react";
import {useEffect} from "react";
import {append, data, getUrl} from "./createProduct";
import {productActions} from "../../../redux/product/actions";
import axios from "axios";
import {prepareToFormData} from "../../../redux/product/epics";

export interface Props {

}


const redactItem=JSON.parse(localStorage.getItem('redact_item') as string)
export const EditProduct: FunctionComponent<Props> = () => {

    const dispatch = useDispatch();
    const userData = useSelector((state: RootStateType) => state.auth.auth);
    const {cust_id} = useParams<{ cust_id: string }>()
    const [path, setPath] = useState<Category[]>([]);
    const {width} = useWindowSize();
    const [redactData, setRedactData] = useState<AddProduct>(data);
    const mergeData = (changes: Partial<AddProduct>) => setRedactData(prepareEntity(changes));
    const [validate, setValidate] = useState(false);
    const [images, setImages] = useState<{ preview: string, name: string }[]>([]);
    const additional_image = useRef<HTMLImageElement>(null);
    const requestState = useSelector((state: RootStateType) => state.product.productSuccess.status);


    const prepareStorage=useMemo(()=>{
        return redactItem.images.map((item: string )=>{return {preview:`http://golowinskiy-api.bostil.ru/api/Img?AppCode=${cust_id}&ImgFileName=${item}`,
            name:`http://golowinskiy-api.bostil.ru/api/Img?AppCode=${cust_id}&ImgFileName=${item}`}})
    },[redactItem]);
    const [mainImage,setMainImage]=useState('');
    useEffect(()=>{
        redactItem.product.Id&&setRedactData(redactItem.product)
        redactItem.images.length&&setImages(prepareStorage)
        redactItem.product.TImageprev&&setMainImage(`http://golowinskiy-api.bostil.ru/api/Img?AppCode=${cust_id}&ImgFileName=${redactItem.product.TImageprev}`)
    },[redactItem]);


    console.log(mainImage)
    const updateProduct = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const filterImages=images.filter(image=>image.name!==image.preview);
      localStorage.setItem('increment',JSON.stringify(images.length-filterImages.length));
        dispatch(productActions.redactProduct.request({product: redactData, images: filterImages.map(image => image.name)}))
    }, [redactData]);


    console.log(redactData)
    const main_image_form_data = new FormData();
    main_image_form_data.append('AppCode', cust_id);
    const add_image_form_data = new FormData();
    add_image_form_data.append('appcode', cust_id);
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
            <div className={styles.md_center}>
                <h3 className={styles.title}>
                    Разместить объявление
                </h3>
            </div>
            <div className={styles.md_center}>
                <div>
                    <Link to={`/${cust_id}`} style={{textDecoration: 'none'}}>
                        Вернуться к каталогу
                    </Link>
                </div>

            </div>
            <div className={styles.md_center}>
                <div>
                    <Link to={`/${cust_id}/personalClient`} style={{textDecoration: 'none'}}>
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
                            }}
                                value={redactData.TName}
                            />
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
                                            getUrl(file).then(name => setMainImage(name));
                                            uploadImage(file).then(() => mergeData({TImageprev: file.name}));
                                        })
                                    );
                                }}
                                />
                                {(mainImage) &&
                                <FontAwesomeIcon icon={faTimes} color={'white'}
                                                 onClick={() => redactData.TImageprev ? mergeData({TImageprev: ''}) : setMainImage('')}
                                                 style={{
                                                     width: '10px',
                                                     height: '10x',
                                                     color: 'black',
                                                     position: "absolute",
                                                     marginLeft: '100px'
                                                 }}/>
                                }
                                <img src={mainImage}/>
                                <FontAwesomeIcon icon={faUpload}/>
                            </div>
                        </div>
                    </div>

                    <div className={styles.item_loading}>

                        {/*{requestState !== 0 &&*/}
                        {/*<div className={styles.loading_text}>*/}
                        {/*    {!preloader &&*/}
                        {/*    <ClipLoader size={18}*/}
                        {/*                color={"black"}/>*/}
                        {/*    }*/}
                        {/*    {*/}
                        {/*        (requestState && requestState !== 200) ?*/}
                        {/*            <div>*/}
                        {/*                Ошибка*/}
                        {/*            </div> :*/}
                        {/*            <div>Товар успешно добавлен</div>*/}

                        {/*    }*/}
                        {/*</div>*/}
                        {/*}*/}
                    </div>

                    <div className={styles.item}>
                        <div className={styles.label_wrapper}>
                            <label>
                                Доп. фотографии
                            </label>
                        </div>

                        <div className={styles.form_wrapper} style={{flexDirection: 'row', display: 'flex'}}>
                            <div className={styles.add_grid} style={{display: 'grid'}}>
                                {
                                    images.map(image =>
                                        <div style={{display: 'flex'}}>
                                            <div className={styles.image}>
                                                <img src={image.preview} ref={additional_image} key={image.name}/>
                                                <FontAwesomeIcon icon={faUpload}/>
                                            </div>
                                            <FontAwesomeIcon icon={faTimes}
                                                             color={'black'}
                                                             style={{paddingLeft: '7px', cursor: 'pointer'}}
                                                             onClick={() => setImages(prevState => ([...prevState.filter(i => i.preview === image.preview ? i.preview = '' : i.preview)]))}/>
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
                                    <FontAwesomeIcon icon={faUpload}/>
                                </div>
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
                                <textarea onChange={event => mergeData({TDescription: event.target.value})}
                                          value={redactData.TDescription}>

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
                            <AuthInput onChange={value => mergeData({TCost: value})} value={redactData.TCost}/>
                        </div>
                    </div>
                    <div className={styles.submitBlock}>
                        <button className={redactData.TName.length < 3 ? styles.button : styles.button_active}
                                onClick={(e) => updateProduct(e)}
                                disabled={redactData.TName.length < 3}>Разместить объявление
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
                            <AuthInput onChange={value => mergeData({video: value})} value={redactData.video ?? ''}/>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.label_wrapper}>
                            <label>
                                Тип изделия
                            </label>
                        </div>
                        <div className={styles.form_wrapper}>
                            <AuthInput onChange={value => mergeData({TypeProd: value})}
                                       value={redactData.TypeProd ?? ''}/>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.label_wrapper}>
                            <label>
                                Конечная цена изделия в рублях
                            </label>
                        </div>
                        <div className={styles.form_wrapper}>
                            <AuthInput onChange={value => mergeData({PrcNt: value})} value={redactData.PrcNt ?? ''}/>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.label_wrapper}>
                            <label>
                                Артикул товара
                            </label>
                        </div>
                        <div className={styles.form_wrapper}>
                            <AuthInput onChange={value => mergeData({TArticle: value})}
                                       value={redactData.TArticle ?? ''}/>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.label_wrapper}>
                            <label>
                                Механизм трансформации
                            </label>
                        </div>
                        <div className={styles.form_wrapper}>
                            <AuthInput onChange={value => mergeData({TransformMech: value})}
                                       value={redactData.TransformMech ?? ''}/>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    )
}