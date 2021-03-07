import { useContext, useState } from 'react';
import ModalContext from "./context/ModalContext"
import {useTransition, animated} from 'react-spring'

function SuccessModal() {
    const { modal, setModal, isOpen, setOpen } = useContext(ModalContext);

    const transition = useTransition(  isOpen, null, {
      from: { transform: 'scale(0.8)' },
      enter: { transform: 'scale(1)' },
      leave: { transform: 'scale(0.8)' },
      config: {
        duration: 75,
      },
    })
    
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
                <h4>Супер!</h4>
                <p>Ваш заказ принят и будет доставлен в ближайшие <span>60 минут!</span></p>
                <img src="https://i.gifer.com/NJJ6.gif" alt=""/>
            </div>

            </animated.div>
                )
            )}
            </div>
        </div>

    )
}

export default SuccessModal