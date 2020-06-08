import React, {useEffect, useState} from 'react';
import {Header} from "./components/static/header/header";
import styles from './AppStyles.module.scss'
import {useDispatch, useSelector} from "react-redux";
import {ShopInfo, shopInfoAction} from "./redux/shopInfo/actions";
import {RootStateType} from "./redux/root";
import {CategoryDropdown} from "./components/category/categoryDropdown";
import {Route, Switch, useParams} from "react-router";
import {Product} from "./components/category/Product";
import {Gallery} from "./components/gallery/gallery";
import {Category} from "./interfaces";
import {init, last, takeLeft} from "fp-ts/es6/Array";
import {CategoryDropdownMobile} from "./components/category/categoryDropdownMobile";
import {useWindowSize} from "react-use";
import {Login} from "./components/auth/login";
import {Registration} from "./components/auth/registration";
import {Sidebar} from "./components/static/header/sidebar";
import {Footer} from "./components/static/footer/footer";
import {Order} from "./components/order/order";
import {Restore} from "./components/auth/restore";
import {history} from "./index";
import {pipe} from "fp-ts/es6/pipeable";
import {getOrElse, map} from "fp-ts/es6/Option";
import axios from 'axios'
import {api_v1, imagePath} from "./api";

function App() {
    const isFooter=useSelector((state:RootStateType)=>state.product.footerState);
    const {width} = useWindowSize();
    const [sidebar, setSidebar] = useState(false);
    const [path, setPath] = useState<Category[]>([]);
    const {cust_id} = useParams<{ cust_id: string }>();
    const [background,setBackground]=useState('')
    useEffect(()=>{
        axios.get<ShopInfo>(api_v1.shopInfo).then(res=>{
            if(res.status===200){
                setBackground(res.data.mainImage)
            }
        }).catch(console.error)
    },[]);


    return (
        <div className={styles.app}
             style={{backgroundImage: ` url(${imagePath}${background}) `}}>
            {(sidebar && width < 1086) &&
            <Sidebar onClose={setSidebar}/>
            }
            <Header setSidebar={setSidebar}/>
            <div className={styles.content}>
                <Switch>
                    <Route exact path={'/:cust_id'} render={() => width > 1068 ? <CategoryDropdown onClick={params => {
                            setPath(params.path)
                            if (params.isLast) {
                                pipe(params.path, last, map(item => history.push(`/${cust_id}/${item.id}`)))
                            }
                        }} path={path}/> :
                        <CategoryDropdownMobile onClick={params => {
                            setPath(params.isOpen ? pipe(params.path, init, getOrElse<Category[]>(() => [])) : params.path)
                            if (params.isLast) {
                                pipe(params.path, last, map(item => history.push(`/${cust_id}/${item.id}`)))
                            }
                        }} path={path}/>}/>

                    <Route path={'/:cust_id/order'} component={Order}/>
                    <Route path={'/:cust_id/login'} component={Login}/>
                    <Route path={'/:cust_id/registration'} component={Registration}/>
                    <Route path={'/:cust_id/restore'} component={Restore}/>
                    <Route path={'/:cust_id/:gallery_id/:product_id'} component={Product}/>
                    <Route path={'/:cust_id/:gallery_id/'}
                           render={() => <Gallery path={path} onClick={(index) => setPath(takeLeft(index))}
                                                  secondClick={setPath}/>}/>

                </Switch>
            </div>
            {
                (isFooter)&&
                <Footer/>
            }

        </div>
    );
}

export default App;
