export interface Category {
    id: string,
    parent_id: string,
    txt: string,
    cust_id: string,
    picture: string,
    isshow: number,
    listInnerCat: Category[]
}

export interface AddProduct {
    Appcode: string
    Catalog: string
    CID: string
    Ctlg_Name: string
    Id: string
    PrcNt?: string
    TArticle?: string
    TCost: string
    TDescription: string
    TImageprev: string|null
    TName: string
    TransformMech?: string
    TypeProd?: string
    video?: string
}

export interface Product {
    prc_ID: number
    image_Site: string
    image_Base: string
    appCode: string
    prc_Br: string
    img: null
    suplier: string
    cust_ID: string
    tName: string
    isShowBasket: string
    gdate: string
    id: string
    parent_id: string
    txtcrumbs: string
    idcrumbs: string
    nameCategories: string[],
    idCategories: string[]
}

export interface ProductDescription {
    catalog: string
    ctlg_Name: string
    ctlg_No: string
    tName: string
    suplier: string
    tDescription: string
    id: string
    sup_ID: string
    wgt: string
    code_1C: string
    qty: string
    delivery: string
    phoneclient: string
    v_isnoprice: string
    isprice: string
    youtube: string
    latitude: null
    longitude: null
    addr: string
    prc_ID: 21829
    prc_Br: string
    t_imageprev: string,
    additionalImages?:{imageOrder:number,t_image:string}[]
}