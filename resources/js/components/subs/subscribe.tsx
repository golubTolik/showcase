import { Link } from "@inertiajs/react";
import React from "react";
import './subs.css';

const Subscribe = () => {
    return(
        <>
            {/* Подписка  */}
                <div className="section-title">Подписка</div>
                <div className="subscribe">
                    <div className="subscribe-grid">
                        <div className="text-zone">
                            <h1>Подпишитесь и получите подарок</h1>
                            <p>Скидка 10% на первый заказ и наша подборка «5 простых способов сделать дом уютнее» — бесплатно для новых подписчиков.</p>
                        </div>
                        <div className="input-zone">
                            <input type="email" placeholder="Ваш E-mail" className="input-main"></input>
                            <label>
                                <input type="checkbox" className="input-rule"></input>
                                <span>Я согласен на обработку персональных данных</span>
                            </label>
                             <div>
                                <Link><button>Подписаться</button></Link>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    );
}
export default Subscribe;
