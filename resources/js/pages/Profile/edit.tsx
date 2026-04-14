import { useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { route } from 'ziggy-js';
import Alert from '@/components/layout/alert';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/Navbar';
import './edit.css';


interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
}

interface Props {
    user: User;
}

export default function Edit({ user }: Props) {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Navbar />
            <Alert flash={flash} autoCloseDelay={5000} />
            <main className="container min-h-screen mx-auto! px-4! py-8! max-w-2xl">
                <h1 className="text-2xl mb-6! font-[Gabriela]">Профиль</h1>

                <form onSubmit={handleSubmit} className="space-y-6! bg-white p-6! rounded-lg shadow-sm!`">
                    <div >
                        <label className="block text-sm font-medium! mb-1!">Имя</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full border rounded-lg px-3! py-2!"
                        />
                        {errors.name && <div className="field-error text-sm mt-1!">{errors.name}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium! mb-1!">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className="w-full border rounded-lg px-3! py-2!"
                        />
                        {errors.email && <div className="field-error text-sm mt-1!">{errors.email}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium! mb-1!">Телефон</label>
                        <input
                            type="tel"
                            value={data.phone}
                            onChange={e => setData('phone', e.target.value)}
                            className="w-full border rounded-lg px-3! py-2!"
                        />
                        {errors.phone && <div className="field-error text-sm mt-1!">{errors.phone}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium! mb-1!">Новый пароль (оставьте пустым, если не хотите менять)</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            className="w-full border rounded-lg px-3! py-2!"
                        />
                        {errors.password && <div className="field-error text-sm mt-1!">{errors.password}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium! mb-1!">Подтверждение пароля</label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                            className="w-full border rounded-lg px-3! py-2!"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#b4632e] cursor-pointer text-white px-6! py-2! rounded-4xl hover:bg-[#9a4f24] disabled:opacity-50"
                        >
                            {processing ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                    </div>
                </form>
            </main>
            <Footer />
        </>
    );
}
