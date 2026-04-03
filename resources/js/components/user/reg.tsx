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
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
                            name='name'
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Введите ваше имя"
                        />
                        {errors.name && <div className="field-error">{errors.name}</div>}
                    </div>
                    <div className='con'>
                        <label className='label'>Email:</label>
                        <Input
                            className='input'
                            type="email"
                            value={data.email}
                            name='email'
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Введите ваш e-mail"
                        />
                        {errors.email && <div className="field-error">{errors.email}</div>}
                    </div>
                    <div className='con'>
                        <label className='label'>Пароль:</label>
                        <Input
                            className='input'
                            type="password"
                            name='password'
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Введите ваш пароль"
                        />
                        {errors.password && <div className="field-error">{errors.password}</div>}
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
