import { usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import React from "react";
// import '../../../css/footer.css';

export default function Reg() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
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
                    <div>
                        <label>Имя:</label>
                        <input
                            type="email"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
                    </div>
                    <div>
                        <label>Пароль:</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
                    </div>
                    <button type="submit" disabled={processing}>
                        Зарегистрироваться 
                    </button>
                </form>
            </div>
        </>
    );
}
