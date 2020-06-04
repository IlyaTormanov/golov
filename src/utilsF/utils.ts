export const prepareEntity=<T>(changes:Partial<T>)=>(object:T)=>({...object,...changes});

export const checkIndex=<T>(item:T,array:T[]):number=> array.findIndex(i=>i===item);




