export const api=window?.__env?.api??'https://bos.hramushina.ru/api/';
export const apiUrl=window?.__env?.apiUrl??'https://bos.hramushina.ru/';
export const shopName=window?.__env?.shopName??'24445';
export const imagePath=window?.__env?.apiUrl??'https://bos.hramushina.ru/';

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