import Link from "next/link"
import { useContext } from "react";
import { CartContext } from "./context/CartContext";

function Header({itemCount}) {
    const { cartItems, cartActive, toggleCart } = useContext(CartContext);


    if(cartItems && cartItems.length > 0){
        itemCount = cartItems.reduce((total, cartItems) => total + cartItems.count, 0);
    }

    return (
        <>
            <header>
                <div className="container">
                    <div className="row">
                            <div className="logo col-sm"><Link href="/"><a>ReactPizza</a></Link></div>
                            <ul className="col-sm">
                                <li><Link href="/"><a>Главная</a></Link></li>
                                <li><Link href="/"><a>Обратная связь</a></Link></li>
                                <li className="cartToggler" onClick={() => toggleCart(!cartActive)}>Корзина {itemCount > 0 ?  <span>| {itemCount}</span> : null}</li>
                            </ul>

                    </div>
                </div>
           </header>
        </>
    )
}

export default Header