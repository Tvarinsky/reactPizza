import ModalContext from './context/ModalContext'
import {useContext} from 'react'
import OrderModal from './OrderModal'
import SuccessModal from './SuccessModal'

function Modals(){
    
    const {modal, setModal} = useContext(ModalContext)

    return(
        <>
        {modal == 'OrderModal' && <OrderModal/>}
        {modal == 'SuccessModal' && <SuccessModal/>}
        </>
    )
}
export default Modals