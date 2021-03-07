import { useFormik } from 'formik'
import { useContext, useState } from 'react';
import axios from 'axios'
import ModalContext from "./context/ModalContext"
import {useTransition, animated} from 'react-spring'
import { CartContext } from './context/CartContext'
import { PromoContext } from './context/PromoContext'
import { useRouter } from 'next/router'
import * as Yup from 'yup'; 

function OrderModal() {
    const router = useRouter()
    const { modal, setModal, isOpen, setOpen } = useContext(ModalContext);
    const { cartItems, setCartItems } = useContext(CartContext);
    const { promo, setInput, discount, setDiscount, freeItem, setFreeItem } = useContext(PromoContext);

    const [error, setError] = useState(false);

    const handleRemove = () => {
        let countCopy = [...cartItems];
        countCopy.splice(0)
        let countCart = JSON.stringify(countCopy);
        setCartItems(countCopy)
        localStorage.setItem("cartItems", countCart)
    }

    console.log(cartItems)

    const formik = useFormik({
    initialValues: {
        name: '',
        phone: '',
        street: '',
        house: ''
    },
    validationSchema: Yup.object().shape({
        name: Yup.string().required('Обязательное поле'),
        phone: Yup.string().required('Обязательное поле'),
        street: Yup.string().required('Обязательное поле'),
        house: Yup.string().required('Обязательное поле')
    }),

    onSubmit: async (values) => {
        await axios({
            method: 'POST',
            url: process.env.NEXT_PUBLIC_SERVER_URL + '/orders/createOrder',
            data: {values : values, cartItems : cartItems, discount : discount}
        }).then(res => {
            handleRemove()
            setModal('SuccessModal')
            router.push('/')
        })
    },
    });


    const transition = useTransition(  isOpen, null, {
      from: { transform: 'scale(0.8)' },
      enter: { transform: 'scale(1)' },
      leave: { transform: 'scale(0.8)' },
      config: {
        duration: 75,
      },
    })

    const inputError = '';

    function validateInput(value) {
        if (value === '') {
            inputError = 'Nice try!';
        }
    }

    return (
            <div className="ordering__modal">

            <div onClick={() => {
                setOpen(false)
                setTimeout(function() {
                    setModal(false)
                }, 100)
            }} class="modal__overlay"></div>

            <div className="positioning" isOpen={isOpen} onRequestClose={() => setOpen(false)}>
            {transition.map(
                ({ item, key, props }) =>
                item && (
            <animated.div key={key} style={props}>

            <div class="modal__content">
                <h4>Куда доставить?</h4>

                {promo ?
                    !freeItem ? 
                        <p>Активный промокод: <span style={{color: 'rgb(255, 105, 0)'}}> {promo}</span></p> 
                        :
                        <p>Активный промокод: <span style={{color: 'rgb(255, 105, 0)'}}>{promo}</span> на бесплатную <span style={{color: 'rgb(255, 105, 0)'}}>{freeItem?.childName}</span></p> 
                    
                : null }

                {!promo && cartItems.length > 0 ? <p>Сумма заказа: {cartItems?.map(cartItems => cartItems.price * cartItems.count)?.reduce((a, b) => a + b) + ' ₽'}</p>
                
                : (discount && cartItems.length > 0) && `Сумма заказа с учетом скидки ${discount}%: ` + cartItems?.map(cartItems => Math.round((cartItems.count * cartItems.price) - (cartItems.count * cartItems.price / 100 * discount)))?.reduce((a, b) => a + b) + ' ₽'}

                <form onSubmit={formik.handleSubmit}>
                <div class="col-lg-12 col-xs-12 row">
                    <div class="col-lg-4 col-xs-6">
                        <label htmlFor="name">Ваше имя</label>
                        <input
                        id="name"
                        name="name"
                        type="text"
                        style={formik.errors.name && {border: '1px solid #d52f3b'}}
                        validate={validateInput}
                        onChange={formik.handleChange}
                        />

                        {formik.errors.name && formik.touched.name && (
                            <p className="error_message">{formik.errors.name}</p>
                        )}
                    </div>
                    <div class="col-lg-4 col-xs-2">
                        <label htmlFor="email">Телефон</label>
                        <input
                        id="phone"
                        name="phone"
                        type="phone"
                        style={formik.errors.phone && {border: '1px solid #d52f3b'}}
                        validate={validateInput}
                        onChange={formik.handleChange}
                        />
                        
                        {formik.errors.phone && formik.touched.phone && (
                            <p className="error_message">{formik.errors.phone}</p>
                        )}
                    </div>
                </div>
                <div class="col-lg-12 col-xs-12 row">
                    <div class="col-lg-6 col-xs-6">
                        <label htmlFor="street">Улица</label>
                        <input
                        id="street"
                        name="street"
                        type="text"
                        style={formik.errors.street && {border: '1px solid #d52f3b'}}
                        validate={validateInput}
                        onChange={formik.handleChange}
                        />

                        {formik.errors.street && formik.touched.street && (
                            <p className="error_message">{formik.errors.street}</p>
                        )}
                    </div>
                    <div class="col-lg-2 col-xs-2">
                        <label htmlFor="house">Дом</label>
                        <input
                        id="house"
                        name="house"
                        style={formik.errors.house && {border: '1px solid #d52f3b'}}
                        type="text"
                        validate={validateInput}
                        onChange={formik.handleChange}
                        />

                        {formik.errors.house && formik.touched.house && (
                            <p className="error_message">{formik.errors.house}</p>
                        )}
                    </div>
                </div>
                <div class="col-lg-12 col-xs-12 row">
                    <div class="col-lg-2 col-xs-2">
                        <label htmlFor="appartment">Квартира</label>
                        <input
                        id="appartment"
                        name="appartment"
                        type="number"
                        onChange={formik.handleChange}
                        />
                    </div>
                    <div class="col-lg-2 col-xs-2">
                        <label htmlFor="entrance">Подъезд</label>
                        <input
                        id="entrance"
                        name="entrance"
                        type="number"
                        onChange={formik.handleChange}
                        />
                    </div>
                    <div class="col-lg-2 col-xs-2">
                        <label htmlFor="intercom">Домофон</label>
                        <input
                        id="intercom"
                        name="intercom"
                        type="number"
                        onChange={formik.handleChange}
                        />
                    </div>
                    <div class="col-lg-2 col-xs-2">
                        <label htmlFor="floor">Этаж</label>
                        <input
                        id="floor"
                        name="floor"
                        type="number"
                        onChange={formik.handleChange}
                        />
                    </div>
                </div>

                <div class="col-lg-12 col-xs-12 row">
                    <div class="col-lg-8 col-xs-8">
                        <label htmlFor="comment">Комментарий к заказу</label>
                        <textarea name="comment" id="comment" onChange={formik.handleChange} cols="30" rows="10"></textarea>
                    </div>
                </div>

                <button type="submit">Подтвердить заказ</button>
                </form>
            </div>

            </animated.div>
                )
            )}
            </div>
        </div>

    )
}

export default OrderModal