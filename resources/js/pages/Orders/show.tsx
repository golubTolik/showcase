import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/Navbar';
import { asset } from '@/utils/helper';

interface OrderItem {
    id: number;
    product_id: number;
    name: string;
    quantity: number;
    price_at_time: number;
    total: number;
    image: string | null;
}

interface Order {
    id: number;
    created_at: string;
    full_name: string;
    phone: string;
    email: string;
    delivery_type: string;
    address: string | null;
    payment_method: string;
    status: string;
    total_price: number;
    comment: string | null;
    items: OrderItem[];
}

interface Props {
    order: Order;
}

export default function OrdersShow({ order }: Props) {
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

    const getDeliveryText = (type: string) => {
        const deliveryMap: Record<string, string> = {
            courier: 'Курьером',
            pickup: 'Самовывоз',
            // post: 'Почта России',
        };

        return deliveryMap[type] || type;
    };

    const getPaymentText = (method: string) => {
        const paymentMap: Record<string, string> = {
            card: 'Картой при получении',
            cash: 'Наличными при получении',
            bank: 'Банковский перевод',
        };

        return paymentMap[method] || method;
    };

    return (
        <>
            <Navbar />
            <main className="container mx-auto! px-4! py-8! max-w-4xl min-h-screen">
                <div className="mb-4!">
                    <Link href={route('orders.index')} className="text-[#b4632e] hover:underline inline-flex items-center gap-1">
                        ← Назад к заказам
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="p-6! border-b bg-gray-50">
                        <div className="flex flex-wrap justify-between items-start gap-4">
                            <div>
                                <h1 className="text-2xl font-bold">Заказ №{order.id}</h1>
                                <p className="text-gray-500">{order.created_at}</p>
                            </div>
                            <div className={`px-3! py-1! border rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                            </div>
                        </div>
                    </div>

                    <div className="p-6! space-y-6!">
                        {/* Информация о доставке и оплате */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h2 className="font-semibold text-lg mb-3!">Данные получателя</h2>
                                <div className="space-y-1! text-sm">
                                    <p><span className="text-gray-500">ФИО:</span> {order.full_name}</p>
                                    <p><span className="text-gray-500">Телефон:</span> {order.phone}</p>
                                    <p><span className="text-gray-500">Email:</span> {order.email}</p>
                                </div>
                            </div>
                            <div>
                                <h2 className="font-semibold text-lg mb-3!">Доставка и оплата</h2>
                                <div className="space-y-1! text-sm">
                                    <p><span className="text-gray-500">Способ доставки:</span> {getDeliveryText(order.delivery_type)}</p>
                                    {order.address && <p><span className="text-gray-500">Адрес:</span> {order.address}</p>}
                                    <p><span className="text-gray-500">Способ оплаты:</span> {getPaymentText(order.payment_method)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Комментарий к заказу */}
                        {order.comment && (
                            <div>
                                <h2 className="font-semibold text-lg mb-2!">Комментарий</h2>
                                <p className="text-gray-700">{order.comment}</p>
                            </div>
                        )}

                        {/* Товары в заказе */}
                        <div>
                            <h2 className="font-semibold text-lg mb-3!">Товары</h2>
                            <div className="space-y-3!">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-4 border-b pb-3! last:border-0">
                                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                            {item.image ? (
                                                <img src={asset(item.image)} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">🖼️</div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <Link href={route('products.show', item.product_id)} className="font-medium hover:text-[#b4632e]">
                                                {item.name}
                                            </Link>
                                            <div className="text-sm text-gray-500">{item.quantity} шт. × {item.price_at_time.toLocaleString()} ₽</div>
                                        </div>
                                        <div className="font-semibold">{(item.price_at_time * item.quantity).toLocaleString()} ₽</div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4! pt-3! border-t text-right">
                                <div className="text-lg font-bold">Итого: {order.total_price.toLocaleString()} ₽</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

// Вспомогательная функция для цвета статуса
function getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
        pending: 'text-yellow-600 bg-yellow-50',
        processing: 'text-blue-600 bg-blue-50',
        shipped: 'text-purple-600 bg-purple-50',
        delivered: 'text-green-600 bg-green-50',
        cancelled: 'text-red-600 bg-red-50',
    };

    return colorMap[status] || 'text-gray-600 bg-gray-50';
}
