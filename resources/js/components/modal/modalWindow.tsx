import React from "react";
import './modalWindow.css';

interface ModalProps {
  active: boolean;
  setActive: (active: boolean) => void;
  children: React.ReactNode;
}

const ModalWindow = ({active, setActive, children}: ModalProps) => {
    return(
        <>
            <div className={active ? "modal active" : "modal"} onClick={()=>setActive(false)}>
                <div className={active ? "modal__content active" : "modal__content"} onClick={event => event.stopPropagation()}>
                    {/* <button></button> */}
                    {children}
                </div>
            </div>
        </>
    );
}
export default ModalWindow;
