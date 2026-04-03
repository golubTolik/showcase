import { usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import React from "react";
import { Input } from "@/components/ui/input"
import './auth.css';

export default function Auth() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/login'); // Отправка POST-запроса на сервер
    };


    return (
        <>
            <div className="container">
                {flash.error && <div className="error">{flash.error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className='con'>
                        <label className='label'>Email:</label>
                        <Input
                            className='input'
                            type="email"
                            value={data.email}
                            name='email'
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Введите e-mail"
                        />
                        {errors.email && <div className="field-error">{errors.email}</div>}
                    </div>
                    <div className='con'>
                        <label className='label'>Пароль:</label>
                        <Input
                            className='input'
                            type="password"
                            value={data.password}
                            name='password'
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Введите пароль"
                        />
                        {errors.password && <div className="field-error">{errors.password}</div>}
                    </div>
                    <div className='class-btn'>
                        <button className='btn' type="submit" disabled={processing}>
                            Авторизоваться
                        </button>
                    </div>

                </form>
            </div>
        </>
    );
}
