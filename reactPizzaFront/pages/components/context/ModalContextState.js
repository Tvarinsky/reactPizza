import { createContext, useContext, useState } from 'react';
import ModalContext from './ModalContext'
const AppModalContext = createContext();

export function ModalContextWrapper({ children }) {
  const [modal, setModal] = useState()
  const [isOpen, setOpen] = useState()


  const { Provider } = ModalContext
  return (
    <Provider value={{modal, setModal, isOpen, setOpen}}>
      {children}
    </Provider>
  );
}
export function useModalContext() {
  return useContext(AppModalContext);
}
