import {createContext, useState } from 'react'

export const PromoContext = createContext(null)
export default function promoContext({children}) {
    const [promo, setInput] = useState('')
    const [discount, setDiscount] = useState();
    const [freeItem, setFreeItem] = useState();

    const {Provider} = PromoContext;
    return (
        <Provider value={{promo, setInput, discount, setDiscount, freeItem, setFreeItem}}>
            {children}
        </Provider>
    )
}
