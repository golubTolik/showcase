import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/Navbar';

interface Order {
    id: number;
    created_at: string;
    status: string;
    total_price: number;
    items_count: number;
}

interface Props {
    orders: Order[];
}

export default function OrdersIndex({ orders }: Props) {
    const getStatusText = (status: string) => {
        const statusMap: Record<string, string> = {
            pending: 'В обработке',
            processing: 'Готовится',
            shipped: 'Отправлен',
            delivered: 'Доставлен',
            cancelled: 'Отменён',
        };

        return statusMap[status] || status;
    };

    const getStatusColor = (status: string) => {
        const colorMap: Record<string, string> = {
            pending: 'text-yellow-600 bg-yellow-50',
            processing: 'text-blue-600 bg-blue-50',
            shipped: 'text-purple-600 bg-purple-50',
            delivered: 'text-green-600 bg-green-50',
            cancelled: 'text-red-600 bg-red-50',
        };

        return colorMap[status] || 'text-gray-600 bg-gray-50';
    };

    return (
        <>
            <Navbar />
            <main className="container mx-auto! px-4! py-8! max-w-5xl min-h-screen">
                <h1 className="text-2xl mb-6! font-[Gabriela]">Мои заказы</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-12!">
                        <p className="text-gray-500 mb-4!">У вас пока нет заказов</p>
                        <Link href={route('catalog')} className="text-[#b4632e] hover:underline">
                            Перейти в каталог
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4!">
                        {orders.map((order) => (
                            <div key={order.id} className="border rounded-lg p-4! bg-white shadow-sm hover:shadow-md transition">
                                <div className="flex flex-wrap justify-between items-start gap-4">
                                    <div>
                                        <div className="text-1xl font-medium text-gray-1000">Заказ №{order.id}</div>
                                        <div className="text-sm text-gray-500">{order.created_at}</div>
                                        <div className="mt-1!">
                                            <span className={`inline-block border px-2! py-1! rounded-full text-xs font-medium! ${getStatusColor(order.status)}`}>
                                                {getStatusText(order.status)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-[#b4632e]">{order.total_price.toLocaleString()} ₽</div>
                                        <div className="text-sm text-gray-500">{order.items_count} товаров</div>
                                    </div>
                                </div>
                                <div className="mt-4! flex justify-end">
                                    <Link href={route('orders.show', order.id)} className="text-[#b4632e] hover:underline text-sm">
                                        Подробнее →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
