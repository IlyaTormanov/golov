import * as React from 'react'
import {FunctionComponent, useEffect, useState} from "react";

import {Footer} from "../footer/footer";
import {Sidebar} from "../header/sidebar";

import {useDispatch, useSelector} from "react-redux";
import {RootStateType} from "../../../redux/root";
import {useWindowSize} from "react-use";
import {CategoryDropdown} from "../../category/categoryDropdown";
import {pipe} from "fp-ts/es6/pipeable";
import {init, last, takeLeft} from "fp-ts/es6/Array";
import {getOrElse, map} from "fp-ts/es6/Option";
import {history} from "../../../index";
import {CategoryDropdownMobile} from "../../category/categoryDropdownMobile";
import {Category} from "../../../interfaces";
import {Route, Switch, useParams} from "react-router";
import styles from './privateOfficeStyles.module.scss'
import {PersonalHeader} from "../header/personalHeader";
import {ShopInfo} from "../../../redux/shopInfo/actions";
import axios from 'axios'
import {api_v1} from "../../../api";
import {Gallery} from "../../gallery/gallery";
import {Product} from "../../category/Product";
import { EditProduct } from '../productCreator/editProduct';
export interface Props{

}

export const PrivateOffice:FunctionComponent<Props>=()=>{
    const [sidebar,setSidebar]=useState(false);
    const isFooter=useSelector((state:RootStateType)=>state.product.footerState);
    const {width} = useWindowSize();
    const user_id=useSelector((state:RootStateType)=>state.auth.auth.userId)
    const {cust_id} = useParams<{  cust_id: string }>();
    const [avatar,setAvatar]=useState<ShopInfo>()
    useEffect(()=>{
       axios.get(api_v1.shopInfo).then(res=>{
           setAvatar(res.data)
       })

    },[])
    const [path, setPath] = useState<Category[]>([]);

    return(

        <div className={styles.office}
             style={{backgroundImage: ` url(http://golowinskiy-api.bostil.ru${avatar?.mainImage}) `}}>
            {(sidebar&&width<1086)&&
            <Sidebar onClose={setSidebar}/>
            }
            <PersonalHeader setSidebar={setSidebar}/>
            <div className={styles.content}>
                <Switch>
                <Route exact path={'/:cust_id/personalClient'} render={()=> width > 1068 ? <CategoryDropdown isCid={user_id} onClick={params => {
                        // setPath(params.isLast? pipe(params.path, init, getOrElse<Category[]>(() => [])): params.path);
                        setPath(params.path)
                        if (params.isLast) {
                            pipe(params.path, last, map(item => history.push(`/${cust_id}/personalClient/${item.id}`)))

                        }
                    }} path={path} /> :
                    <CategoryDropdownMobile isCid={user_id} onClick={params => {
                        setPath(params.isOpen? pipe(params.path, init, getOrElse<Category[]>(() => [])): params.path)
                        if (params.isLast) {
                            pipe(params.path, last, map(item => history.push(`/${cust_id}/personalClient/${item.id}`)))

                        }
                    }} path={path} />}/>
                    <Route path={'/:cust_id/personalClient/:gallery_id/:product_id'} render= {()=><Product isLc={true}/> }/>
                    <Route path={'/:cust_id/personalClient/:gallery_id/'} render={()=><Gallery isLk={true}
                                                                                               path={path}
                                                                                               cid={user_id}
                                                                                               onClick={(index) => setPath(takeLeft(index))} secondClick={setPath}/>}/>

                </Switch>
            </div>



            {
                (isFooter)&&
                <Footer/>
            }

        </div>
    )
}
