import { useForm } from "@inertiajs/react";
import React from "react";
// import { useState } from "react";
import { route } from 'ziggy-js';
import './subs.css';

const Subscribe = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        agreement: false,
    });

    // const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('subscribe.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('email', 'agreement');
                // setSubmitted(true);
                // setTimeout(() => setSubmitted(false), 5000);
            },
        });
    };

    return (
        <>
            <div className="section-title">Подписка</div>
            <div className="subscribe">
                <div className="subscribe-grid">
                    <div className="text-zone">
                        <h1>Подпишитесь и получите подарок</h1>
                        <p>Скидка 10% на первый заказ и наша подборка «5 простых способов сделать дом уютнее» — бесплатно для новых подписчиков.</p>
                    </div>
                    <div className="input-zone">
                        {/* {submitted && (
                            <div className="success-message">✓ Вы успешно подписались!</div>
                        )} */}
                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="Ваш E-mail"
                                className="input-main"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                disabled={processing}
                            />
                            {errors.email && <div className="error-message">{errors.email}</div>}
                            <label>
                                <input
                                    type="checkbox"
                                    className="input-rule"
                                    checked={data.agreement}
                                    onChange={e => setData('agreement', e.target.checked)}
                                    disabled={processing}
                                />
                                <span>Я согласен на обработку персональных данных</span>
                            </label>
                            {errors.agreement && <div className="error-message">{errors.agreement}</div>}
                            <div>
                                <button type="submit" disabled={processing}>
                                    {processing ? 'Отправка...' : 'Подписаться'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Subscribe;
