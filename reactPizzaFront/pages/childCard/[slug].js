import Head from 'next/head'
import axios from 'axios'
import Link from 'next/link'
import { useContext, useEffect, useState } from "react";
import { CartContext } from '../components/context/CartContext'

function childCard({dai_rebenka_syka: pizzaItem}) {
  const { cartItems, setCartItems } = useContext(CartContext);
  const { cartActive, toggleCart } = useContext(CartContext);
  const [tooltipActive, tooltipToggle] = useState(false);

  const [pizzaSize, chooseSize] = useState(pizzaItem.childSize?.find(item => item.size == 'medium'));
  const [topping, chooseTopping] = useState([]);
  const [toppingsPrice, setToppingsPrice] = useState(0);

  const handleSize = e => {
    chooseSize(pizzaItem.childSize.find(item => item.size == e.target.value))
  }

  const inCart = {
    id: pizzaItem.id,
    price: pizzaSize ? pizzaSize.price + toppingsPrice : pizzaItem.childPrice,
    title: pizzaItem.childName,
    size: pizzaSize?.size,
    image: pizzaItem.childPhotos[0].url,
    count: 1,
    topping: topping,
    slug: pizzaItem.childSlug
  }

  const handleTopping = (e) => {
    if (topping.find(item => item === e.target.value)){
      let toppingCopy = [...topping]
      toppingCopy.splice(toppingCopy.findIndex(item => item == e.target.value), 1)
      chooseTopping(toppingCopy)
      setToppingsPrice(toppingsPrice - pizzaItem.Toppingi.find(item => item.toppingName == e.target.value).toppingPrice)
    }
    else{
      chooseTopping([...topping, e.target.value])
      setToppingsPrice(pizzaItem.Toppingi.find(item => item.toppingName == e.target.value).toppingPrice + toppingsPrice)
    }
  }

  const handleClick = () => {


    if (!cartActive) {
      toggleCart(!cartActive)
    } 

    let cartCopy = [...cartItems];

    if (cartCopy.find(item => item.id == inCart.id && item.size == inCart.size && JSON.stringify(inCart.topping) == JSON.stringify(item.topping))) {
      cartCopy[cartCopy.findIndex(item => item.id == inCart.id && item.size == inCart.size && JSON.stringify(inCart.topping) == JSON.stringify(item.topping))].count += 1;
      setCartItems(cartCopy)
    } 
    else {
      setCartItems([...cartItems, inCart])
    }
  }
 
    return(
        <>
        <Head>
            <link rel="stylesheet" href='/slick.min.css'/>
        </Head>
        
            <div className="container">
                <div className="row">
                    <div className="col-sm-6">
                            {pizzaItem.childPhotos.map(zalypka => (
                                <img className={pizzaSize?.size == 'small' ? 'small' : pizzaSize?.size == 'medium' ? 'medium' : pizzaSize?.size == 'big' ? 'big' : null} src={process.env.NEXT_PUBLIC_SERVER_URL + zalypka.url} alt=""/>
                            ))}
                    </div>
                    <div className="col-sm-6">
                        <div className="information__about">
                            <h1>{pizzaItem.childName} 


                            {pizzaItem.childKalorii != null ? <div onClick={() => tooltipToggle(!tooltipActive)} class="icon">
                              <i class="sc-1lk7lib-0 lmohzF svg-icon">
                                <svg class="i-information" viewBox="0 0 23 23" preserveAspectRatio="xMidYMin meet" xmlns="http://www.w3.org/2000/svg">
                                  <path class="i-information__circle-fill" fill="#f1f2f5" d="M23 11.5C23 17.8513 17.8513 23 11.5 23C5.14873 23 0 17.8513 0 11.5C0 5.14873 5.14873 0 11.5 0C17.8513 0 23 5.14873 23 11.5Z"></path>
                                  <path class="i-information__i" fill="#000000" d="M11.5 8C12.0658 8 12.5 7.56579 12.5 7C12.5 6.44737 12.0789 6 11.5 6C10.9605 6 10.5 6.44737 10.5 7C10.5 7.56579 10.9737 8 11.5 8ZM12.2968 16.1278C12.2968 16.6108 11.9716 17 11.4903 17C11.022 17 10.6968 16.6108 10.6968 16.1278V10.5722C10.6968 10.0892 11.022 9.7 11.4903 9.7C11.9846 9.7 12.2968 10.0892 12.2968 10.5722V16.1278Z"></path>
                                </svg>
                              </i>
                            </div>
                            : null}
                            <div class={!tooltipActive ? 'tooltipchik' : 'tooltipchik__active'}>
                              <p>
                                Пищевая ценность на 100г. <br/><br/>
                                Энерг. ценность: <span>{pizzaItem.childKalorii}</span><br/>
                                Белки: <span>{pizzaItem.childBelki}</span><br/>
                                Жиры: <span>{pizzaItem.childJiry}</span><br/>
                                Углеводы: <span>{pizzaItem.childYglevody}</span>
                              </p>
                            </div>


                            <span>{pizzaSize ? toppingsPrice + pizzaSize.price : pizzaItem.childPrice} ₽</span></h1>
                            <p>{pizzaItem.childAbout}</p>


                            {pizzaSize ? <p>Пицца-сайз</p> : null}
                            
                            {pizzaItem.childSize.map(item =>
                              <button onClick={
                                (e) => {
                                  handleSize(e);
                                  var elems = document.querySelectorAll(".active_size");
                                  [].forEach.call(elems, function(el) {
                                    el.classList.remove("active_size");
                                  });
                                  e.target.classList.toggle('active_size');
                                }} value={item.size} class={item.size == pizzaSize.size ? 'size active_size' : 'size'}>{item.size == 'small' ? 'Маленькая' : item.size == 'medium' ? 'Средняя' : item.size == 'big' ? 'Большая' : null}</button>
                            )}

                            {pizzaItem.Toppingi.length > 0 && <p style={{marginTop: '40px'}}>Присадки?</p> }

                            <div class="row">
                              {pizzaItem.Toppingi.map(item =>
                                <button className="topping col-lg-3 col-xs-6" value={item.toppingName} onClick={
                                  e => {
                                    handleTopping(e);
                                    e.target.classList.toggle('active_topping');
                                  }}>
                                  <img src={process.env.NEXT_PUBLIC_SERVER_URL + item.toppingPhoto.url} alt=""/>
                                  <p>{item.toppingName}</p>
                                  <h5>{item.toppingPrice} ₽</h5>
                                </button>
                              )}
                            </div>

                            <button className="cart" onClick={handleClick}>В корзину | {pizzaSize ? toppingsPrice + pizzaSize.price : pizzaItem.childPrice} ₽</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(ctx) {

    const children = `
    query {
      children (
        where: {  childSlug: "${ctx.query.slug}" }
      ) {
        id
        childName
        childAbout
        childSlug
        childBelki
        childKalorii
        childJiry
        childYglevody
        childPrice
        Toppingi {
          id
          toppingPrice
          toppingName
          toppingPhoto {
            url
          }
        }
        childSize {
          size
          id
          price
        }
        childPhotos {
          url
        }
      }
    }
    `
  
    const dai_rebenka_syka = await axios ({
      method: 'GET',
      url: process.env.NEXT_PUBLIC_SERVER_URL + '/graphql?query=' + encodeURIComponent(children)
    }).then(res => res.data.data.children[0]);
    return {
      props:{
        dai_rebenka_syka
      }
    }
  }

export default childCard;