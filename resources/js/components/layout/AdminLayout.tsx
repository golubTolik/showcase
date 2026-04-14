// resources/js/components/layout/AdminLayout.tsx
import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { route } from 'ziggy-js';
import Footer from './footer';
import Navbar from './Navbar';


export default function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
    return (
        <>
            <Navbar />
            <div className="flex min-h-screen ">
                <aside className="w-64 bg-white shadow-md">
                    <nav className="p-4 space-y-2">
                        <Link href={route('admin.orders.index')} className="block px-4! py-2! rounded hover:bg-gray-100">Заказы</Link>
                        <Link href={route('admin.categories.index')} className="block px-4! py-2! rounded hover:bg-gray-100">Категории</Link>
                        <Link href={route('admin.products.index')} className="block px-4! py-2! rounded hover:bg-gray-100">Товары</Link>
                    </nav>
                </aside>
                <main className="flex-1 p-6!">
                    <h1 className="text-2xl font-bold mb-4!">{title}</h1>
                    {children}
                </main>
            </div>
            <Footer />
        </>
    );
}
