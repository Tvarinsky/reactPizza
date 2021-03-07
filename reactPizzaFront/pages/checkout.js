import Head from 'next/head';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { CartContext } from './components/context/CartContext'
import ModalContext from './components/context/ModalContext'
import {PromoContext} from './components/context/PromoContext'
import axios from 'axios'

function Checkout() {
    const { modal, setModal, isOpen, setOpen } = useContext(ModalContext)
    const { cartItems, setCartItems } = useContext(CartContext);
    const { promo, setInput, discount, setDiscount, freeItem, setFreeItem } = useContext(PromoContext);

    const [error, setError] = useState(false);
    const [sucess, setSuccess] = useState(false);

    const handlePlus = (idx) => {
        let countCopy = [...cartItems]
        if (countCopy[idx].count + 1 < 99) {
            countCopy[idx].count += 1
            setCartItems(countCopy)
            let countCart = JSON.stringify(countCopy);
            localStorage.setItem("cartItems", countCart)
        } else {
            alert(countCopy[idx].count);
        }
    }

    const handlePromo = () => {
        if (promo != '') {
            axios({
                method: 'POST',
                url: process.env.NEXT_PUBLIC_SERVER_URL + '/promocode/checkPromocode',
                data: {promo}
            }).then(res => {
                setDiscount(res.data.value.discount)
                setFreeItem(res.data.value.freeProduct)
                setSuccess(true)
            }).catch(err => {
                setError(true)
            })
        } else {
            setError(true)
        }
    }

    const handleMinus = (idx) => {
        let countCopy = [...cartItems];
        if (countCopy[idx].count - 1 > 0) {
            countCopy[idx].count -= 1
            setCartItems(countCopy)
            let countCart = JSON.stringify(countCopy);
            localStorage.setItem("cartItems", countCart)
        }
        else {
            let countCopy = [...cartItems];
            countCopy.splice(idx, 1)
            let countCart = JSON.stringify(countCopy);
            setCartItems(countCopy)
            localStorage.setItem("cartItems", countCart)
        }
    }

    const handleRemove = (idx) => {
        let countCopy = [...cartItems];
        countCopy.splice(idx, 1)
        let countCart = JSON.stringify(countCopy);
        setCartItems(countCopy)
        localStorage.setItem("cartItems", countCart)
    }

    return (
        <>
        <Head>
            <link rel="stylesheet" href="checkout.css"/>
        </Head>
        <div className="container">
            <div className="row">

                <div className="checkout">
                    {cartItems?.length > 0 ? <h1 className="text-center">Ваш заказ</h1> : null}
                    {cartItems?.length > 0 ? cartItems.map((item, idx) => (
                        <div className="product col-lg-12 row">
                            <div className="col-lg-2">
                                <Link href={'/childCard/' + item.slug}><a>
                                    <img src={process.env.NEXT_PUBLIC_SERVER_URL + item.image} alt=""/>
                                </a></Link>
                            </div>
                            <div class="col-lg-4">
                                <h5>{item.title}</h5>
                                {item.size ? <span style={{fontSize: '10px', display: 'inline-block', width: 'max-content', marginTop: '5px', color: '#fff', background: '#f46b45', borderRadius: '30px', padding: '5px 10px'}}>{item.size == 'big' ? '40см' : item.size == 'medium' ? '30см' : item.size == 'small' ? '20см' : null}</span> : null} 
                                {item.topping.length > 0 ? item.topping.map(toppings => (
                                    <span style={{fontSize: '10px', marginTop: '5px', marginLeft: '5px', color: '#fff', display: 'inline-block', background: '#2c2c2c', borderRadius: '30px', padding: '5px 10px'}}>
                                    {toppings}
                                    </span>
                                )) : null}
                            </div>
                            <div className="values col-lg-3">
                                <button className="left" onClick={() => {handleMinus(idx)}}>-</button>
                                <input type="text" readOnly value={item.count}/>
                                <button className="right" onClick={() => {handlePlus(idx)}}>+</button>
                            </div>
                            <div className="total col-lg-3">
                                <p>{item.price * item.count} ₽  <button className="remove" onClick={() => {handleRemove(idx)}}><svg width="20" height="20" fill="none" class="sc-157hvfs-7 djSfxW"><path d="M14.75 6h-9.5l.66 9.805c.061 1.013.598 1.695 1.489 1.695H12.6c.89 0 1.412-.682 1.49-1.695L14.75 6z" fill="#373536"></path><path d="M13.85 3.007H6.196C4.984 2.887 5.021 4.365 5 5h9.992c.024-.62.07-1.873-1.142-1.993z" fill="#373535"></path></svg></button></p>
                            </div>
                        </div>
                    )) : (
                    <div className="text-center">
                        <h1>Ваша корзина пуста :c</h1>
                        <Link href="/"><a className="back">На главную</a></Link>
                    </div>
                    )}

                    {console.log(freeItem)}

                    {cartItems?.length > 0 && freeItem ? 
                    
                    <div className="product col-lg-12 row">
                    <div className="col-lg-2">
                        <Link href={'/childCard/' + freeItem.childSlug}><a>
                            <img src={process.env.NEXT_PUBLIC_SERVER_URL + freeItem.childPhoto.url} alt=""/>
                        </a></Link>
                    </div>
                    <div class="col-lg-4">
                        <h5>{freeItem.childName}</h5>
                    </div>
                    <div className="values col-lg-3">
                        <button className="left" disabled>-</button>
                        <input type="text" readOnly value="1"/>
                        <button className="right" disabled>+</button>
                    </div>
                    <div className="total col-lg-3">
                        <p>0 ₽  <button className="remove" disabled><img style={{width: '20px'}} src={process.env.NEXT_PUBLIC_CLIENT_URL + '/gift-box.svg'} alt=""/></button></p>
                    </div>
                </div>
                    
                    : null}

                    {cartItems?.length > 0 &&
                        <>
                            <div className="totalOrder">
                                <h5>Сумма заказа: <span style={discount ? {fontSize: '14px', color: '#777777', textDecoration: 'line-through'} : null}>{cartItems?.map(cartItems => cartItems.price * cartItems.count).reduce((a, b) => a + b) + ' ₽' }</span>
                                
                                <span>{discount && cartItems?.map(cartItems => Math.round((cartItems.count * cartItems.price) - (cartItems.count * cartItems.price / 100 * discount))).reduce((a, b) => a + b) + ' ₽'}</span>

                                {freeItem &&
                                    <p style={{fontSize: '12px'}}>Ваш промокод на {freeItem.childName} успешно применен <span onClick={()=> {
                                        setFreeItem(false)
                                        setInput('')
                                    }} style={{cursor: 'pointer'}}>Отменить?</span></p>
                                }

                                {discount &&
                                <p style={{fontSize: '12px'}}>Ваш промокод на скидку  {discount}% успешно применен <span onClick={()=> {
                                    setDiscount(false)
                                    setInput('')
                                }} style={{cursor: 'pointer'}}>Отменить?</span></p>
                                }
                                
                                  <button onClick={() => {
                                    setModal('OrderModal'),
                                    setOpen(true)
                                }}>Оформить заказ</button></h5> 
                            </div>


                            <div class="promocode">
                            <div class="col-lg-12 col-xs-12 row">
                                <div class="col-lg-8 col-xs-12">
                                    <label htmlFor="promocode">Промокод?</label>
                                    <input
                                    id="promocode"
                                    name="promocode"
                                    type="text"
                                    required="true"
                                    value={promo}
                                    onInput={(e) => setInput(e.target.value)}
                                    />

                                    <button disabled={discount || freeItem && true} onClick={handlePromo}>Применить</button>

                                    {error && <div class="promo_tooltip">
                                        {promo != '' ? `Промокод не найден! Попробуем другой?` : `Поле промокод не может быть пустым` }
                                          <div onClick={() => setError(false)} class="close">
                                            <i class="sc-1lk7lib-0 jkSByL svg-icon tooltip__close-control-icon">
                                                <svg viewBox="0 0 22 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xlinkHref="http://www.w3.org/1999/xlink">
                                                    <path fill="#FFFFFF" fill-opacity="0.2" fill-rule="evenodd" d="M 11 0C 4.92487 1.14941e-15 -7.1838e-16 4.92487 0 11C 8.62056e-16 17.0751 4.92487 22 11 22C 17.0751 22 22 17.0751 22 11C 22 4.92487 17.0751 -1.14941e-15 11 0Z"></path>
                                                    <path transform="translate(6.5 6.5)" fill="#fff" fill-rule="evenodd" d="M 5.33691 4.39941L 8.60645 1.12793C 8.86426 0.870117 8.86426 0.452148 8.60645 0.193359C 8.34863 -0.0644531 7.93066 -0.0644531 7.67285 0.193359L 4.39941 3.46582L 1.12988 0.193359C 0.87207 -0.0644531 0.454102 -0.0644531 0.196289 0.193359C -0.0654297 0.452148 -0.0654297 0.870117 0.196289 1.12793L 3.46582 4.39941L 0.196289 7.67188C -0.0654297 7.92969 -0.0654297 8.34863 0.196289 8.60645C 0.454102 8.86426 0.87207 8.86426 1.12988 8.60645L 4.39941 5.33398L 7.67285 8.60645C 7.93066 8.86426 8.34863 8.86426 8.60645 8.60645C 8.86426 8.34863 8.86426 7.92969 8.60645 7.67188L 5.33691 4.39941Z"></path>
                                                </svg>
                                            </i>
                                        </div>
                                    </div>}

                                    {sucess && <div class="promo_tooltip">
                                        Промокод успешно<br/>
                                        применен. <img style={{maxWidth: '24px', marginRight: '10px'}} src="https://cdn.discordapp.com/emojis/681057923283419229.png" alt=""/>
                                          <div onClick={() => setSuccess(false)} class="close">
                                            <i class="sc-1lk7lib-0 jkSByL svg-icon tooltip__close-control-icon">
                                                <svg viewBox="0 0 22 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xlinkHref="http://www.w3.org/1999/xlink">
                                                    <path fill="#FFFFFF" fill-opacity="0.2" fill-rule="evenodd" d="M 11 0C 4.92487 1.14941e-15 -7.1838e-16 4.92487 0 11C 8.62056e-16 17.0751 4.92487 22 11 22C 17.0751 22 22 17.0751 22 11C 22 4.92487 17.0751 -1.14941e-15 11 0Z"></path>
                                                    <path transform="translate(6.5 6.5)" fill="#fff" fill-rule="evenodd" d="M 5.33691 4.39941L 8.60645 1.12793C 8.86426 0.870117 8.86426 0.452148 8.60645 0.193359C 8.34863 -0.0644531 7.93066 -0.0644531 7.67285 0.193359L 4.39941 3.46582L 1.12988 0.193359C 0.87207 -0.0644531 0.454102 -0.0644531 0.196289 0.193359C -0.0654297 0.452148 -0.0654297 0.870117 0.196289 1.12793L 3.46582 4.39941L 0.196289 7.67188C -0.0654297 7.92969 -0.0654297 8.34863 0.196289 8.60645C 0.454102 8.86426 0.87207 8.86426 1.12988 8.60645L 4.39941 5.33398L 7.67285 8.60645C 7.93066 8.86426 8.34863 8.86426 8.60645 8.60645C 8.86426 8.34863 8.86426 7.92969 8.60645 7.67188L 5.33691 4.39941Z"></path>
                                                </svg>
                                            </i>
                                        </div>
                                    </div>}

                                </div>
                            </div>
                        </div>
                        </>
                    }
                </div>
                
            </div>
        </div>

        </>
    )
}

export default Checkout;