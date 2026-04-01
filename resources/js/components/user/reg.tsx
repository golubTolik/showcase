import { usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import React from "react";
import { Input } from "@/components/ui/input"
import './auth.css';

export default function Reg() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
    });
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const handleSubmit = (event) => {
        event.preventDefault();
        post('/registration'); // Отправка POST-запроса на сервер
    };


    return (
        <>
            <div className="container">
                {flash.error && <div className="error">{flash.error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className='con'>
                        <label className='label'>Имя:</label>
                        <Input
                            className='input'
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Введите ваше имя"
                        />
                        {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
                    </div>
                    <div className='con'>
                        <label className='label'>Email:</label>
                        <Input
                            className='input'
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Введите ваш e-mail"
                        />
                        {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
                    </div>
                    <div className='con'>
                        <label className='label'>Пароль:</label>
                        <Input
                            className='input'
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Введите ваш пароль"
                        />
                        {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
                    </div>
                    <div className='class-btn'>
                        <button className='btn' type="submit" disabled={processing}>
                            Зарегистрироваться
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
