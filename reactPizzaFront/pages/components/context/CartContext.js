import {createContext, useState, useEffect} from 'react'

export const CartContext = createContext(null)
export default function cartContext({children}) {
    const [cartItems, setCartItems] = useState([]);
    const [cartActive, toggleCart] = useState(false);

    useEffect(() => {
        if (cartItems?.length > 0) {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
    }, [cartItems]);

    useEffect(() => {
        if(localStorage.getItem('cartItems')) {
            setCartItems(JSON.parse(localStorage.getItem('cartItems')))
        }
    }, [])

    const {Provider} = CartContext;
    return (
        <Provider value={{cartItems, setCartItems, cartActive, toggleCart}}>
            {children}
        </Provider>
    )
}
