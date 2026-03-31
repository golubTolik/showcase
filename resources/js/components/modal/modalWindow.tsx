import React from "react";
import './modalWindow.css';

const ModalWindow = ({active, setActive, children}) => {
    return(
        <>
            <div className={active ? "modal active" : "modal"} onClick={()=>setActive(false)}>
                <div className={active ? "modal__content active" : "modal__content"} onClick={event => event.stopPropagation()}>
                    {children}
                </div>
            </div>
        </>
    );
}
export default ModalWindow;
