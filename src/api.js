export const api=window?.__env?.api??'http://golowinskiy-api.bostil.ru/api/';
export const apiUrl=window?.__env?.apiUrl??'http://golowinskiy-api.bostil.ru/';
export const shopName=window?.__env?.shopName??'golowinskiy';
export const imagePath=window?.__env?.apiUrl??'http://golowinskiy-api.bostil.ru/';

export const api_v1={
    shopInfo:`${api}shopinfo/${shopName}`,
    categories:`${api}categories`,
    gallery:`${api}Gallery/Filter`,
    galleryProduct:`${api}/Img`,
    auth:`${api}Authorization`,
    uploadImage:`${api}img/upload/`,
    addProduct:`${api}product`,
    additionalImage:`${api}AdditionalImg`,
    load:`${api}Load`,
    order:`${api}order/`,
    addToCart:`${api}addtocart`,
    restore:`${api}restore`

};